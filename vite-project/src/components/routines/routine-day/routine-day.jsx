function RoutineDay({ day, active, onSelect, onStatusChange }) {
  const statusOptions = [
    { value: "pending", label: "Pendiente" },
    { value: "completed", label: "Hecho" },
    { value: "missed", label: "Cancelado" },
  ];

  return (
    <tr className={active ? "active-row" : ""}>
      <td>
        <button className="row-button" type="button" onClick={() => onSelect(day)}>
          {day.day}
        </button>
      </td>
      <td>{day.trainingType || "Descanso"}</td>
      <td>{day.duration || 0} min</td>
      <td>
        <div className="status-control" aria-label="Estado del entrenamiento">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`status-option ${option.value === day.status ? `${option.value} active` : ""}`}
              type="button"
              onClick={() => onStatusChange(day, option.value)}
              aria-pressed={option.value === day.status}
            >
              {option.label}
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}

export default RoutineDay;
