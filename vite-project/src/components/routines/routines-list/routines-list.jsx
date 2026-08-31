import RoutineItem from "../routine-item/routine-item";

function RoutinesList({ routines }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Semana</th>
          <th>Dias</th>
          <th>Completados</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {routines.map((routine) => (
          <RoutineItem key={routine._id} routine={routine} />
        ))}
      </tbody>
    </table>
  );
}

export default RoutinesList;
