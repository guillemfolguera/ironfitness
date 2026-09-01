import { useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { RoutineForm } from "../components/routines";
import * as ApiService from "../services/api-services";

function RoutineNewPage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setError(null);
    try {
      const routine = await ApiService.createRoutine(payload);
      navigate(`/routines/${routine._id}`);
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login");
      setError(err?.response?.data?.message || "No se pudo crear la rutina");
    }
  };

  return (
    <PageLayout title="Nueva rutina semanal">
      {error && <p className="error">{error}</p>}
      <RoutineForm onSubmit={handleSubmit} />
    </PageLayout>
  );
}

export default RoutineNewPage;
