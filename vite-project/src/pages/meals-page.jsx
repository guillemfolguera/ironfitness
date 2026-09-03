import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { MealsList } from "../components/meals";
import * as ApiService from "../services/api-services";

function sumDailyMeals(meals, date) {
  return meals
    .filter((meal) => meal.date?.slice(0, 10) === date)
    .reduce(
      (summary, meal) => ({
        calories: summary.calories + Number(meal.calories || 0),
        protein: summary.protein + Number(meal.protein || 0),
      }),
      { calories: 0, protein: 0 },
    );
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString();
}

function Comparison({ change, date }) {
  return (
    <div className="card-comparison">
      {change ? (
        <>
          <span className={`comparison-change ${change.direction}`}>
            {change.direction === "up"
              ? "↑"
              : change.direction === "down"
                ? "↓"
                : "→"}{" "}
            {change.percentage}%
          </span>
          <small>vs {formatDate(date)}</small>
        </>
      ) : (
        <small>Sin comparación</small>
      )}
    </div>
  );
}

function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  const load = async () => setMeals(await ApiService.listMeals());

  useEffect(() => {
    let ignore = false;

    const loadInitial = async () => {
      try {
        const items = await ApiService.listMeals();
        if (!ignore) setMeals(items);
      } catch (error) {
        if (error?.response?.status === 401) navigate("/login");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadInitial();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const mealDates = useMemo(
    () =>
      [
        ...new Set(
          meals.map((meal) => meal.date?.slice(0, 10)).filter(Boolean),
        ),
      ].sort((a, b) => new Date(b) - new Date(a)),
    [meals],
  );

  useEffect(() => {
    setSelectedDate((current) =>
      mealDates.includes(current) ? current : mealDates[0] || "",
    );
  }, [mealDates]);

  const dailyComparison = useMemo(() => {
    const previousDate = mealDates.find((date) => date < selectedDate);
    const current = sumDailyMeals(meals, selectedDate);
    const previous = previousDate ? sumDailyMeals(meals, previousDate) : null;

    return {
      current,
      previous,
      previousDate,
    };
  }, [meals, mealDates, selectedDate]);

  const getChange = (currentValue, previousValue) => {
    if (previousValue === null || previousValue === 0) return null;

    const percentage = ((currentValue - previousValue) / previousValue) * 100;

    return {
      direction: percentage > 0 ? "up" : percentage < 0 ? "down" : "same",
      percentage: Math.abs(Math.round(percentage * 10) / 10),
    };
  };

  const caloriesChange = getChange(
    dailyComparison.current.calories,
    dailyComparison.previous?.calories ?? null,
  );
  const proteinChange = getChange(
    dailyComparison.current.protein,
    dailyComparison.previous?.protein ?? null,
  );

  const handleDelete = async (id) => {
    await ApiService.deleteMeal(id);
    await load();
  };

  return (
    <PageLayout
      title="Alimentación"
      action={
        <Link className="primary-button" to="/meals/new">
          Registrar comida
        </Link>
      }
    >
      {meals.length > 0 && (
        <>
          <label className="day-field">
            Día
            <select
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            >
              {mealDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(`${date}T00:00:00`).toLocaleDateString()}
                </option>
              ))}
            </select>
          </label>
          <div className="summary-grid">
            <article className="metric-card">
              <span>Total calorías</span>
              <strong>{dailyComparison.current.calories} kcal</strong>
              <Comparison
                change={caloriesChange}
                date={dailyComparison.previousDate}
              />
            </article>
            <article className="metric-card">
              <span>Total proteínas</span>
              <strong>{dailyComparison.current.protein} g</strong>
              <Comparison
                change={proteinChange}
                date={dailyComparison.previousDate}
              />
            </article>
          </div>
        </>
      )}
      <section className="panel wide-panel">
        <h2>Registro de comidas</h2>
        {loading ? (
          <p className="empty-state">Cargando...</p>
        ) : meals.length ? (
          <MealsList meals={meals} onDelete={handleDelete} />
        ) : (
          <p className="empty-state">No hay comidas registradas.</p>
        )}
      </section>
    </PageLayout>
  );
}

export default MealsPage;
