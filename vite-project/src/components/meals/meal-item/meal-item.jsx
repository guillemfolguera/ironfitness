function MealItem({ meal, onDelete }) {
  const { name, date, calories, protein } = meal;

  return (
    <tr>
      <td>{name}</td>
      <td>{new Date(date).toLocaleDateString()}</td>
      <td>{calories}</td>
      <td>{protein} g</td>
      {onDelete && (
        <td>
          <button className="ghost-button" type="button" onClick={() => onDelete(meal._id)}>
            Borrar
          </button>
        </td>
      )}
    </tr>
  );
}

export default MealItem;
