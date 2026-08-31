function RoutineDay({ day, active, onSelect, onStatusChange }) {
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
        <select className={`status-select ${day.status}`} value={day.status} onChange={(event) => onStatusChange(day, event.target.value)}>
          <option value="pending">Pendiente</option>
          <option value="completed">Hecho</option>
          <option value="missed">Perdido</option>
        </select>
      </td>
    </tr>
  );
}

export default RoutineDay;
