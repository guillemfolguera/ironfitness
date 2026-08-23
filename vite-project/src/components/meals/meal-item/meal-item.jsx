function MealItem({ meal }) {
  const { name, date, calories, protein } = meal;

  return (
    <tr>
      <td>{name}</td>
      <td>{new Date(date).toLocaleDateString()}</td>
      <td>{calories}</td>
      <td>{protein} g</td>
    </tr>
  );
}

export default MealItem;