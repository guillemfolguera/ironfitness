import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { MealsList } from "../components/meals";
import * as ApiService from "../services/api-services";

function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (id) => {
    await ApiService.deleteMeal(id);
    await load();
  };

  return (
    <PageLayout title="Alimentacion" action={<Link className="primary-button" to="/meals/new">Registrar comida</Link>}>
      <section className="panel wide-panel">
        <h2>Registro de comidas</h2>
        {loading ? <p className="empty-state">Cargando...</p> : meals.length ? <MealsList meals={meals} onDelete={handleDelete} /> : <p className="empty-state">No hay comidas registradas.</p>}
      </section>
    </PageLayout>
  );
}

export default MealsPage;
