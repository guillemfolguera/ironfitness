import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { WeightForm, WeightsList } from "../components/weights";
import * as ApiService from "../services/api-services";

function WeightChart({ weights }) {
  const chartData = useMemo(() => {
    const sorted = [...weights]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-8);
    if (!sorted.length) return { points: [], yTicks: [] };
    const values = sorted.map((entry) => entry.weight);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const step = range <= 10 ? 2 : 5;
    const lowerBound = Math.floor(min / step) * step;
    const upperBound = Math.ceil(max / step) * step || lowerBound + step;
    const span = upperBound - lowerBound || step;
    const yTicks = Array.from(
      { length: Math.floor(span / step) + 1 },
      (_, index) => lowerBound + index * step,
    );
    const points = sorted.map((entry, index) => {
      const x =
        sorted.length === 1 ? 108 : 28 + (index * 160) / (sorted.length - 1);
      const y = 88 - ((entry.weight - lowerBound) * 68) / span;
      return { x, y, weight: entry.weight, date: entry.date };
    });

    return { points, yTicks, lowerBound, span };
  }, [weights]);

  const { points, yTicks, lowerBound, span } = chartData;

  return (
    <svg
      className="weight-chart"
      viewBox="0 0 200 110"
      role="img"
      aria-label="Evolucion de peso"
    >
      <line x1="28" y1="90" x2="188" y2="90" />
      <line x1="28" y1="10" x2="28" y2="90" />
      <text className="chart-axis-label" x="30" y="9">
        kg
      </text>
      <text className="chart-axis-label" x="176" y="106">
        Fecha
      </text>
      {yTicks.map((tick) => {
        const y = 88 - ((tick - lowerBound) * 68) / span;

        return (
          <g key={tick}>
            <line className="chart-grid-line" x1="28" y1={y} x2="188" y2={y} />
            <text
              className="chart-tick-label"
              x="24"
              y={y + 2}
              textAnchor="end"
            >
              {tick}
            </text>
          </g>
        );
      })}
      {points.length > 1 && (
        <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
      )}
      {points.map(({ x, y, weight, date }, index) => (
        <g key={`${x}-${y}-${index}`}>
          <circle className="chart-point" cx={x} cy={y} r="2.5" />
          {index > 0 && (
            <text className="chart-value" x={x} y={y - 6} textAnchor="middle">
              {weight} kg
            </text>
          )}
          <text className="chart-date" x={x} y="98" textAnchor="middle">
            {new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
              "es-ES",
              {
                day: "2-digit",
                month: "2-digit",
              },
            )}
          </text>
        </g>
      ))}
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

  const weightSummary = useMemo(() => {
    const orderedWeights = [...weights].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    const initialWeight = orderedWeights[0]?.weight;
    const currentWeight = orderedWeights.at(-1)?.weight;

    return {
      initialWeight,
      currentWeight,
      difference:
        initialWeight !== undefined && currentWeight !== undefined
          ? currentWeight - initialWeight
          : null,
    };
  }, [weights]);

  return (
    <PageLayout title="Peso">
      <div className="weight-summary-grid">
        <article className="metric-card">
          <span>Peso inicial</span>
          <strong>
            {weightSummary.initialWeight !== undefined
              ? `${weightSummary.initialWeight} kg`
              : "Sin datos"}
          </strong>
        </article>
        <article className="metric-card">
          <span>Peso actual</span>
          <strong>
            {weightSummary.currentWeight !== undefined
              ? `${weightSummary.currentWeight} kg`
              : "Sin datos"}
          </strong>
        </article>
        <article className="metric-card">
          <span>Diferencia de peso</span>
          <strong>
            {weightSummary.difference !== null
              ? `${weightSummary.difference > 0 ? "+" : ""}${weightSummary.difference.toFixed(1)} kg`
              : "Sin datos"}
          </strong>
        </article>
      </div>
      <div className="split-layout">
        <section className="panel">
          <h2>Añadir peso actual</h2>
          <WeightForm onSubmit={handleCreate} />
          <WeightChart weights={weights} />
        </section>
        <section className="panel">
          <h2>Historial de peso</h2>
          {loading ? (
            <p className="empty-state">Cargando...</p>
          ) : weights.length ? (
            <WeightsList weights={weights} onDelete={handleDelete} />
          ) : (
            <p className="empty-state">Sin pesos registrados.</p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

export default WeightsPage;
