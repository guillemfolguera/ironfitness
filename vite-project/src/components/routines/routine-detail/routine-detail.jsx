import { useState } from "react";
import RoutineDay from "../routine-day/routine-day";

function DayEditor({ selectedDay, onUpdateDay, onDeleteDay }) {
  const [form, setForm] = useState(selectedDay || {});

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateDay(form);
  };

  return (
    <form className="panel-form" onSubmit={handleSubmit}>
      <label>
        Dia
        <input value={form.day || ""} onChange={(event) => setForm((current) => ({ ...current, day: event.target.value }))} required />
      </label>
      <label>
        Tipo
        <input value={form.trainingType || ""} onChange={(event) => setForm((current) => ({ ...current, trainingType: event.target.value }))} />
      </label>
      <label>
        Duracion
        <input type="number" min="0" value={form.duration || 0} onChange={(event) => setForm((current) => ({ ...current, duration: Number(event.target.value) }))} />
      </label>
      <label>
        Estado
        <select value={form.status || "pending"} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
          <option value="pending">Pendiente</option>
          <option value="completed">Hecho</option>
          <option value="missed">Perdido</option>
        </select>
      </label>
      <label>
        Descripcion
        <textarea value={form.details || ""} onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))} />
      </label>
      <div className="button-row">
        <button className="ghost-button" type="button" onClick={() => onDeleteDay(selectedDay)}>
          Borrar
        </button>
        <button className="primary-button" type="submit">Guardar</button>
      </div>
    </form>
  );
}

function RoutineDetail({ routine, selectedDay, onSelectDay, onUpdateDay, onDeleteDay, onStatusChange }) {
  if (!routine) return null;

  return (
    <div className="split-layout">
      <section className="panel wide-panel">
        <h2>Rutina semanal</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Dia</th>
              <th>Tipo</th>
              <th>Duracion</th>
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
      </section>
      <section className="panel detail-panel">
        <h2>Detalle entrenamiento</h2>
        {selectedDay ? (
          <DayEditor key={selectedDay._id} selectedDay={selectedDay} onUpdateDay={onUpdateDay} onDeleteDay={onDeleteDay} />
        ) : (
          <p className="empty-state">No hay entrenamientos en esta rutina.</p>
        )}
      </section>
    </div>
  );
}

export default RoutineDetail;
