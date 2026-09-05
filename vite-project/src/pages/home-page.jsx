import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import * as ApiService from "../services/api-services";
import { startOfNaturalWeek, toDateValue } from "../utils/week";

const objectiveLabels = {
  "lose-weight": "Perder peso",
  "gain-muscle": "Ganar músculo",
  maintain: "Mantener",
};

const statusLabels = {
  pending: "Pendiente",
  completed: "Hecho",
  missed: "Cancelado",
};

function latestByDate(items, field = "date") {
  return [...items].sort((a, b) => new Date(b[field]) - new Date(a[field]))[0];
}

function HomePage() {
  const [state, setState] = useState({
    loading: true,
    profile: null,
    routines: [],
    meals: [],
    weights: [],
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, routines, meals, weights] = await Promise.all([
          ApiService.getProfile(),
          ApiService.listRoutines(),
          ApiService.listMeals(),
          ApiService.listWeights(),
        ]);
        setState({
          loading: false,
          profile,
          routines,
          meals,
          weights,
          error: null,
        });
      } catch (error) {
        if (error?.response?.status === 401) navigate("/login");
        setState((current) => ({
          ...current,
          loading: false,
          error: "No se pudo cargar el resumen",
        }));
      }
    };

    load();
  }, [navigate]);

  const summary = useMemo(() => {
    const currentWeight = latestByDate(state.weights)?.weight;
    const currentWeek = toDateValue(startOfNaturalWeek());
    const activeRoutine =
      state.routines.find(
        (routine) =>
          toDateValue(startOfNaturalWeek(routine.week)) === currentWeek,
      ) || latestByDate(state.routines, "week");
    const routineDays = activeRoutine?.days || [];
    return {
      currentWeight,
      activeRoutine,
      completed: routineDays.filter((day) => day.status === "completed").length,
      pending: routineDays.filter((day) => day.status === "pending").length,
      missed: routineDays.filter((day) => day.status === "missed").length,
      recentMeals: [...state.meals]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3),
    };
  }, [state]);

  if (state.loading)
    return (
      <PageLayout title="Home">
        <p className="empty-state">Cargando...</p>
      </PageLayout>
    );

  return (
    <PageLayout title={`Hola, ${state.profile?.name || "atleta"}`}>
      {state.error && <p className="error">{state.error}</p>}
      <div className="metrics-grid">
        <article className="metric-card">
          <span>Tu objetivo</span>
          <strong>
            {objectiveLabels[state.profile?.objective] || "Sin objetivo"}
          </strong>
        </article>
        <article className="metric-card">
          <span>Peso actual</span>
          <strong>
            {summary.currentWeight
              ? `${summary.currentWeight} kg`
              : "Sin datos"}
          </strong>
        </article>
        <article className="metric-card">
          <span>Sesiones hechas esta semana</span>
          <strong>{summary.completed}</strong>
        </article>
        <article className="metric-card">
          <span>Pendientes</span>
          <strong>{summary.pending}</strong>
        </article>
      </div>

      <div className="split-layout">
        <section className="panel">
          <div className="panel-title">
            <h2>Tu plan para esta semana</h2>
            <Link className="ghost-button" to="/routines">
              Ver rutinas
            </Link>
          </div>
          {summary.activeRoutine ? (
            <table className="data-table">
              <tbody>
                {summary.activeRoutine.days?.map((day) => (
                  <tr key={day._id}>
                    <td>{day.day}</td>
                    <td>{day.trainingType || "Descanso"}</td>
                    <td>
                      <span className={`status-pill ${day.status}`}>
                        {statusLabels[day.status] || day.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Todavia no tienes rutina semanal.</p>
          )}
        </section>
        <section className="panel">
          <div className="panel-title">
            <h2>Últimas comidas</h2>
            <Link className="ghost-button" to="/meals">
              Ver alimentación
            </Link>
          </div>
          {summary.recentMeals.length ? (
            <div className="mini-summary">
              {summary.recentMeals.map((meal) => (
                <div className="recent-meal" key={meal._id}>
                  <strong>{meal.name}</strong>
                  <span>{meal.calories} kcal</span>
                  <span>{meal.protein} g proteína</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">Sin comidas registradas.</p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

export default HomePage;
