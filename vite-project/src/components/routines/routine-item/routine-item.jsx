import { Link } from "react-router";

function RoutineItem({ routine }) {
  const completed = routine.days?.filter((day) => day.status === "completed").length || 0;
  const total = routine.days?.length || 0;

  return (
    <tr>
      <td>{new Date(routine.week).toLocaleDateString()}</td>
      <td>{total} dias</td>
      <td>{completed}/{total}</td>
      <td>
        <Link className="ghost-button" to={`/routines/${routine._id}`}>Ver</Link>
      </td>
    </tr>
  );
}

export default RoutineItem;
