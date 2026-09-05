import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageLayout } from "../components/layouts";
import { RoutineDetail } from "../components/routines";
import * as ApiService from "../services/api-services";

function RoutineDetailPage() {
  const { routineId, dayId } = useParams();
  const [routine, setRoutine] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const selectedDay = useMemo(() => {
    if (!routine?.days?.length) return null;
    return routine.days.find((day) => day._id === dayId) || routine.days[0];
  }, [routine, dayId]);

  const refresh = async () => {
    const routines = await ApiService.listRoutines();
    const current = routines.find((item) => item._id === routineId);
    setRoutine(current || null);
    if (!current) setError("Rutina no encontrada");
  };

  useEffect(() => {
    let ignore = false;

    const loadInitial = async () => {
      try {
        const routines = await ApiService.listRoutines();
        if (ignore) return;
        const current = routines.find((item) => item._id === routineId);
        setRoutine(current || null);
        if (!current) setError("Rutina no encontrada");
      } catch (err) {
        if (err?.response?.status === 401) navigate("/login");
        if (!ignore) setError("No se pudo cargar la rutina");
      }
    };

    loadInitial();
    return () => {
      ignore = true;
    };
  }, [routineId, navigate]);

  const handleSelectDay = (day) =>
    navigate(`/routines/${routineId}/days/${day._id}`);

  const handleStatusChange = async (day, status) => {
    try {
      const updatedDay = await ApiService.updateRoutineDayStatus(
        routineId,
        day._id,
        { status },
      );
      setRoutine((current) => ({
        ...current,
        days: current.days.map((currentDay) =>
          currentDay._id === updatedDay._id
            ? { ...currentDay, status: updatedDay.status }
            : currentDay,
        ),
      }));
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login");
      setError(
        err?.response?.data?.message || "No se pudo actualizar el estado",
      );
    }
  };

  const handleUpdateDay = async (day) => {
    await ApiService.updateRoutineDay(routineId, day._id, day);
    await refresh();
  };

  const handleDeleteDay = async (day) => {
    await ApiService.deleteRoutineDay(routineId, day._id);
    await refresh();
    navigate(`/routines/${routineId}`);
  };

  return (
    <PageLayout title="Detalle entrenamiento">
      {error && <p className="error">{error}</p>}
      {!routine && !error ? (
        <p className="empty-state">Cargando...</p>
      ) : (
        <RoutineDetail
          routine={routine}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          onStatusChange={handleStatusChange}
          onUpdateDay={handleUpdateDay}
          onDeleteDay={handleDeleteDay}
        />
      )}
    </PageLayout>
  );
}

export default RoutineDetailPage;
