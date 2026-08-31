import MealItem from "../meal-item/meal-item";

function MealsList({ meals, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Comida</th>
          <th>Fecha</th>
          <th>Calorias</th>
          <th>Proteinas</th>
          {onDelete && <th />}
        </tr>
      </thead>
      <tbody>
        {meals.map((meal) => (
          <MealItem key={meal._id} meal={meal} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}

export default MealsList;
