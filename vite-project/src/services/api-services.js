import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || "/api/v1",
  withCredentials: true,
});

const unwrap = ({ data }) => data;

export const signup = async (userData) => unwrap(await http.post("/signup", userData));
export const login = async (credentials) => unwrap(await http.post("/login", credentials));
export const logout = async () => unwrap(await http.delete("/logout"));

export const getProfile = async () => unwrap(await http.get("/profile"));
export const updateProfile = async (profileData) => unwrap(await http.put("/profile", profileData));
export const uploadProfileAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return unwrap(await http.post("/profile/avatar", formData));
};

export const listMeals = async () => unwrap(await http.get("/meals"));
export const createMeal = async (mealData) => unwrap(await http.post("/meals", mealData));
export const deleteMeal = async (id) => unwrap(await http.delete(`/meals/${id}`));

export const listWeights = async () => unwrap(await http.get("/weights"));
export const createWeight = async (weightData) => unwrap(await http.post("/weights", weightData));
export const deleteWeight = async (id) => unwrap(await http.delete(`/weights/${id}`));

export const listRoutines = async () => unwrap(await http.get("/routines"));
export const createRoutine = async (routineData) => unwrap(await http.post("/routines", routineData));
export const getRoutineDay = async (routineId, dayId) => unwrap(await http.get(`/routines/${routineId}/days/${dayId}`));
export const updateRoutineDay = async (routineId, dayId, dayData) => unwrap(await http.put(`/routines/${routineId}/days/${dayId}`, dayData));
export const deleteRoutineDay = async (routineId, dayId) => unwrap(await http.delete(`/routines/${routineId}/days/${dayId}`));
export const updateRoutineDayStatus = async (routineId, dayId, statusData) => unwrap(await http.patch(`/routines/${routineId}/days/${dayId}`, statusData));
