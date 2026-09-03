import { useEffect, useState } from "react";
import RoutineItem from "../routine-item/routine-item";

function RoutinesList({ routines }) {
  const routinesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const chronologicalRoutines = [...routines].sort(
    (a, b) => new Date(a.week) - new Date(b.week),
  );
  const weekNumbersById = new Map(
    chronologicalRoutines.map((routine, index) => [routine._id, index + 1]),
  );
  const orderedRoutines = [...chronologicalRoutines].reverse();
  const totalPages = Math.ceil(orderedRoutines.length / routinesPerPage);
  const pageStart = (currentPage - 1) * routinesPerPage;
  const visibleRoutines = orderedRoutines.slice(
    pageStart,
    pageStart + routinesPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(Math.max(totalPages, 1));
  }, [currentPage, totalPages]);

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>Semana</th>
            <th>Semana natural</th>
            <th>Días</th>
            <th>Completados</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {visibleRoutines.map((routine) => (
            <RoutineItem
              key={routine._id}
              routine={routine}
              weekNumber={weekNumbersById.get(routine._id)}
            />
          ))}
        </tbody>
      </table>
      <div className="pagination" aria-label="Paginación de rutinas">
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

export default RoutinesList;
