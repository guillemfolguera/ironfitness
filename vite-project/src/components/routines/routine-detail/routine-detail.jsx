import { useState } from "react";
import { Link } from "react-router";
import RoutineDay from "../routine-day/routine-day";
import { formatNaturalWeek } from "../../../utils/week";

function DayEditor({ selectedDay, onUpdateDay, onDeleteDay }) {
  const [form, setForm] = useState(selectedDay || {});

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateDay(form);
  };

  return (
    <form className="panel-form" onSubmit={handleSubmit}>
      <label>
        Día
        <input value={form.day || ""} readOnly required />
      </label>
      <label>
        Tipo
        <input
          value={form.trainingType || ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              trainingType: event.target.value,
            }))
          }
        />
      </label>
      <label>
        Duración
        <input
          type="number"
          min="0"
          value={form.duration || 0}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              duration: Number(event.target.value),
            }))
          }
        />
      </label>
      <label>
        Descripción
        <textarea
          value={form.details || ""}
          onChange={(event) =>
            setForm((current) => ({ ...current, details: event.target.value }))
          }
        />
      </label>
      <div className="button-row">
        <button
          className="ghost-button"
          type="button"
          onClick={() => onDeleteDay(selectedDay)}
        >
          Borrar
        </button>
        <button className="primary-button" type="submit">
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

function RoutineDetail({
  routine,
  selectedDay,
  onSelectDay,
  onUpdateDay,
  onDeleteDay,
  onStatusChange,
}) {
  if (!routine) return null;

  return (
    <div className="split-layout">
      <section className="panel wide-panel">
        <div className="panel-title">
          <h2>Rutina semanal</h2>
          <span className="field-hint">{formatNaturalWeek(routine.week)}</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Tipo</th>
              <th>Duración</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {routine.days?.map((day) => (
              <RoutineDay
                key={day._id}
                day={day}
                active={day._id === selectedDay?._id}
                onSelect={onSelectDay}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>

        <div className="button-row" style={{ marginTop: "1.5rem" }}>
          <Link className="ghost-button" to="/routines">
            Volver a rutinas
          </Link>
        </div>
      </section>
      <section className="panel detail-panel">
        <h2>Detalle entrenamiento</h2>
        {selectedDay ? (
          <DayEditor
            key={selectedDay._id}
            selectedDay={selectedDay}
            onUpdateDay={onUpdateDay}
            onDeleteDay={onDeleteDay}
          />
        ) : (
          <p className="empty-state">No hay entrenamientos en esta rutina.</p>
        )}
      </section>
    </div>
  );
}

export default RoutineDetail;
