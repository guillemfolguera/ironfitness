import { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayLabels = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miercoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sabado",
  Sunday: "Domingo",
};

function emptyDays() {
  return days.map((day) => ({ day, trainingType: "", duration: 0, details: "", status: "pending" }));
}

function RoutineForm({ onSubmit }) {
  const [week, setWeek] = useState(new Date().toISOString().slice(0, 10));
  const [routineDays, setRoutineDays] = useState(emptyDays);

  const updateDay = (index, field, value) => {
    setRoutineDays((current) =>
      current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, [field]: value } : entry)),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      week,
      days: routineDays.map((entry) => ({ ...entry, duration: Number(entry.duration || 0) })),
    });
  };

  return (
    <form className="routine-form" onSubmit={handleSubmit}>
      <label className="week-field">
        Semana
        <input type="date" value={week} onChange={(event) => setWeek(event.target.value)} required />
      </label>
      <div className="routine-grid">
        {routineDays.map((entry, index) => (
          <fieldset key={entry.day} className="day-editor">
            <legend>{dayLabels[entry.day]}</legend>
            <input placeholder="Entrenamiento" value={entry.trainingType} onChange={(event) => updateDay(index, "trainingType", event.target.value)} />
            <input type="number" min="0" placeholder="Minutos" value={entry.duration} onChange={(event) => updateDay(index, "duration", event.target.value)} />
            <textarea placeholder="Detalles" value={entry.details} onChange={(event) => updateDay(index, "details", event.target.value)} />
            <select value={entry.status} onChange={(event) => updateDay(index, "status", event.target.value)}>
              <option value="pending">Pendiente</option>
              <option value="completed">Hecho</option>
              <option value="missed">Perdido</option>
            </select>
          </fieldset>
        ))}
      </div>
      <button className="primary-button" type="submit">Crear rutina</button>
    </form>
  );
}

export default RoutineForm;
