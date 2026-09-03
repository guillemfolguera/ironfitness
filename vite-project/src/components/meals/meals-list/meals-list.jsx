import { useEffect, useState } from "react";
import MealItem from "../meal-item/meal-item";

function MealsList({ meals, onDelete }) {
  const mealsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const orderedMeals = [...meals].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const totalPages = Math.ceil(orderedMeals.length / mealsPerPage);
  const pageStart = (currentPage - 1) * mealsPerPage;
  const visibleMeals = orderedMeals.slice(pageStart, pageStart + mealsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(Math.max(totalPages, 1));
  }, [currentPage, totalPages]);

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>Comida</th>
            <th>Fecha</th>
            <th>Calorías</th>
            <th>Proteínas</th>
            {onDelete && <th />}
          </tr>
        </thead>
        <tbody>
          {visibleMeals.map((meal) => (
            <MealItem key={meal._id} meal={meal} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
      <div className="pagination" aria-label="Paginación de comidas">
        <button
          className="ghost-button"
          type="button"
          onClick={() => setCurrentPage((page) => page - 1)}
          disabled={currentPage === 1}
        >
          Página anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="ghost-button"
          type="button"
          onClick={() => setCurrentPage((page) => page + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente página
        </button>
      </div>
    </>
  );
}

export default MealsList;
