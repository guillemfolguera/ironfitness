import { useLocation, Routes, Route } from "react-router";
import { Navbar } from "./components/ui";
import {
  HomePage,
  LoginPage,
  MealNewPage,
  MealsPage,
  ProfilePage,
  RegisterPage,
  RoutineDetailPage,
  RoutineNewPage,
  RoutinesPage,
  WeightsPage,
} from "./pages";
import "./App.css";

function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className={isAuthPage ? "app auth-shell" : "app"}>
      {!isAuthPage && <Navbar />}
      <main className="app-main">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/new" element={<RoutineNewPage />} />
          <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          <Route path="/routines/:routineId/days/:dayId" element={<RoutineDetailPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/meals/new" element={<MealNewPage />} />
          <Route path="/weight" element={<WeightsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
