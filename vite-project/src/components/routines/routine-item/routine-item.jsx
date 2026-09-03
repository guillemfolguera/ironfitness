import { Link } from "react-router";
import { formatNaturalWeek } from "../../../utils/week";

function RoutineItem({ routine, weekNumber }) {
  const completed =
    routine.days?.filter((day) => day.status === "completed").length || 0;
  const total = routine.days?.length || 0;

  return (
    <tr>
      <td>{weekNumber}</td>
      <td>{formatNaturalWeek(routine.week)}</td>
      <td>{total} días</td>
      <td>
        {completed}/{total}
      </td>
      <td>
        <Link className="ghost-button" to={`/routines/${routine._id}`}>
          Ver
        </Link>
      </td>
    </tr>
  );
}

export default RoutineItem;
