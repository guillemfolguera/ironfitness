import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { WeightForm, WeightsList } from "../components/weights";
import * as ApiService from "../services/api-services";

function WeightChart({ weights }) {
  const points = useMemo(() => {
    const sorted = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-8);
    if (sorted.length < 2) return "";
    const values = sorted.map((entry) => entry.weight);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return sorted.map((entry, index) => {
      const x = 12 + (index * 176) / (sorted.length - 1);
      const y = 88 - ((entry.weight - min) * 68) / span;
      return `${x},${y}`;
    }).join(" ");
  }, [weights]);

  return (
    <svg className="weight-chart" viewBox="0 0 200 110" role="img" aria-label="Evolucion de peso">
      <line x1="12" y1="90" x2="188" y2="90" />
      <line x1="12" y1="10" x2="12" y2="90" />
      {points && <polyline points={points} />}
    </svg>
  );
}

function WeightsPage() {
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => setWeights(await ApiService.listWeights());

  useEffect(() => {
    let ignore = false;

    const loadInitial = async () => {
      try {
        const items = await ApiService.listWeights();
        if (!ignore) setWeights(items);
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

  const handleCreate = async (payload) => {
    await ApiService.createWeight(payload);
    await load();
  };

  const handleDelete = async (id) => {
    await ApiService.deleteWeight(id);
    await load();
  };

  return (
    <PageLayout title="Peso">
      <div className="split-layout">
        <section className="panel">
          <h2>Anadir peso objetivo</h2>
          <WeightForm onSubmit={handleCreate} />
          <WeightChart weights={weights} />
        </section>
        <section className="panel">
          <h2>Historial de peso</h2>
          {loading ? <p className="empty-state">Cargando...</p> : weights.length ? <WeightsList weights={weights} onDelete={handleDelete} /> : <p className="empty-state">Sin pesos registrados.</p>}
        </section>
      </div>
    </PageLayout>
  );
}

export default WeightsPage;
