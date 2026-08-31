import { NavLink, useNavigate } from "react-router";
import * as ApiService from "../../../services/api-services";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await ApiService.logout().catch(() => null);
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <NavLink className="brand" to="/">
        <span className="brand-mark">IF</span>
        <span>Iron Fitness</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/routines">Rutinas</NavLink>
        <NavLink to="/meals">Alimentacion</NavLink>
        <NavLink to="/weight">Peso</NavLink>
        <NavLink to="/profile">Perfil</NavLink>
      </div>
      <button className="icon-button sidebar-exit" type="button" onClick={handleLogout} title="Cerrar sesion">
        Salir
      </button>
    </nav>
  );
}

export default Navbar;
