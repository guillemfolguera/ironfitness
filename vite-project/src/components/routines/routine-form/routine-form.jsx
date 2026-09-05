import { useState } from "react";
import {
  getWeekOptions,
  startOfNaturalWeek,
  toDateValue,
} from "../../../utils/week";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function emptyDays() {
  return days.map((day) => ({
    day,
    trainingType: "",
    duration: 0,
    details: "",
    status: "pending",
  }));
}

function RoutineForm({ onSubmit }) {
  const weekOptions = getWeekOptions();
  const [week, setWeek] = useState(toDateValue(startOfNaturalWeek()));
  const [routineDays, setRoutineDays] = useState(emptyDays);

  const updateDay = (index, field, value) => {
    setRoutineDays((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      week,
      days: routineDays.map((entry) => ({
        ...entry,
        duration: Number(entry.duration || 0),
      })),
    });
  };

  return (
    <form className="routine-form" onSubmit={handleSubmit}>
      <label className="week-field">
        Semana
        <select
          value={week}
          onChange={(event) => setWeek(event.target.value)}
          required
        >
          {weekOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="routine-grid">
        {routineDays.map((entry, index) => (
          <fieldset key={entry.day} className="day-editor">
            <legend>{entry.day}</legend>
            <input
              placeholder="Entrenamiento"
              value={entry.trainingType}
              onChange={(event) =>
                updateDay(index, "trainingType", event.target.value)
              }
            />
            <div className="duration-field">
              <input
                type="number"
                min="0"
                value={entry.duration}
                onChange={(event) =>
                  updateDay(index, "duration", event.target.value)
                }
              />
              <span>minutos</span>
            </div>
            <textarea
              placeholder="Detalles"
              value={entry.details}
              onChange={(event) =>
                updateDay(index, "details", event.target.value)
              }
            />
          </fieldset>
        ))}
      </div>
      <button className="primary-button" type="submit">
        Crear rutina
      </button>
    </form>
  );
}

export default RoutineForm;
