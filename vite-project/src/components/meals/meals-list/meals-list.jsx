import { useState, useEffect } from 'react';
import * as ApiService from '../../services/api-services';
import MealItem from '../meal-item/meal-item';

function MealsList() {
  const [meals, setMeals] = useState();

  useEffect(() => {
    async function fetchMeals() {
      try {
        const meals = await ApiService.listMeals();
        setMeals(meals);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMeals();
  }, []);

  if (!meals) return null;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Comida</th>
          <th>Fecha</th>
          <th>Calorías</th>
          <th>Proteínas</th>
        </tr>
      </thead>

      <tbody>
        {meals.map((meal) => (
          <MealItem key={meal._id} meal={meal} />
        ))}
      </tbody>
    </table>
  );
}

export default MealsList;