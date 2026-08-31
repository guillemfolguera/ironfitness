import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { RoutinesList } from "../components/routines";
import * as ApiService from "../services/api-services";

function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.listRoutines()
      .then(setRoutines)
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <PageLayout title="Rutinas" action={<Link className="primary-button" to="/routines/new">Nueva rutina</Link>}>
      <section className="panel wide-panel">
        <h2>Tus rutinas semanales</h2>
        {loading ? <p className="empty-state">Cargando...</p> : routines.length ? <RoutinesList routines={routines} /> : <p className="empty-state">No hay rutinas todavia.</p>}
      </section>
    </PageLayout>
  );
}

export default RoutinesPage;
