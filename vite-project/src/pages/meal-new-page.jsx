import { useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { MealForm } from "../components/meals";
import * as ApiService from "../services/api-services";

function MealNewPage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setError(null);
    try {
      await ApiService.createMeal(payload);
      navigate("/meals");
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login");
      setError(err?.response?.data?.message || "No se pudo guardar la comida");
    }
  };

  return (
    <PageLayout title="Registro de comida">
      {error && <p className="error">{error}</p>}
      <section className="panel narrow-panel">
        <MealForm onSubmit={handleSubmit} />
      </section>
    </PageLayout>
  );
}

export default MealNewPage;
