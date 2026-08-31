import WeightItem from "../weight-item/weight-item";

function WeightsList({ weights, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Peso</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {weights.map((entry) => (
          <WeightItem key={entry._id} entry={entry} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}

export default WeightsList;
