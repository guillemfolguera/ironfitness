import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true
});

// AUTH

export const signup = async (userData) => {
  const { data } = await http.post('/signup', userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await http.post('/login', credentials);
  return data;
};

export const logout = async () => {
  const { data } = await http.delete('/logout');
  return data;
};


// PROFILE

export const getProfile = async () => {
  const { data } = await http.get('/profile');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await http.put('/profile', profileData);
  return data;
};


// MEALS

export const listMeals = async () => {
  const { data } = await http.get('/meals');
  return data;
};

export const createMeal = async (mealData) => {
  const { data } = await http.post('/meals', mealData);
  return data;
};

export const deleteMeal = async (id) => {
  const { data } = await http.delete(`/meals/${id}`);
  return data;
};


// WEIGHTS

export const listWeights = async () => {
  const { data } = await http.get('/weights');
  return data;
};

export const createWeight = async (weightData) => {
  const { data } = await http.post('/weights', weightData);
  return data;
};

export const deleteWeight = async (id) => {
  const { data } = await http.delete(`/weights/${id}`);
  return data;
};


// ROUTINES

export const listRoutines = async () => {
  const { data } = await http.get('/routines');
  return data;
};

export const createRoutine = async (routineData) => {
  const { data } = await http.post('/routines', routineData);
  return data;
};

export const getRoutineDay = async (routineId, dayId) => {
  const { data } = await http.get(
    `/routines/${routineId}/days/${dayId}`
  );
  return data;
};

export const updateRoutineDay = async (routineId, dayId, dayData) => {
  const { data } = await http.put(
    `/routines/${routineId}/days/${dayId}`,
    dayData
  );
  return data;
};

export const deleteRoutineDay = async (routineId, dayId) => {
  const { data } = await http.delete(
    `/routines/${routineId}/days/${dayId}`
  );
  return data;
};

export const updateRoutineDayStatus = async (routineId, dayId, statusData) => {
  const { data } = await http.patch(
    `/routines/${routineId}/days/${dayId}`,
    statusData
  );
  return data;
};