function WeightItem({ entry, onDelete }) {
  return (
    <tr>
      <td>{new Date(entry.date).toLocaleDateString()}</td>
      <td>{entry.weight} kg</td>
      <td>
        <button className="ghost-button" type="button" onClick={() => onDelete(entry._id)}>
          Borrar
        </button>
      </td>
    </tr>
  );
}

export default WeightItem;
