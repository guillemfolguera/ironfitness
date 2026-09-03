import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import * as ApiService from "../../../services/api-services";

function Navbar() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.getProfile()
      .then(setProfile)
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/login");
      });
  }, [navigate]);

  const handleLogout = async () => {
    await ApiService.logout().catch(() => null);
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <NavLink className="brand" to="/">
        <span className="brand-name">Iron Fitness</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/routines">Rutinas</NavLink>
        <NavLink to="/meals">Alimentación</NavLink>
        <NavLink to="/weight">Peso</NavLink>
        <NavLink to="/profile">Perfil</NavLink>
      </div>
      <div className="sidebar-profile">
        <Link
          className="brand-mark"
          to="/profile"
          title="Ir al perfil"
          aria-label="Ir al perfil"
        >
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Foto de perfil" />
          ) : (
            profile?.name?.[0]?.toUpperCase() || "I"
          )}
        </Link>
        <span className="sidebar-profile-name">
          {profile?.name || "Usuario"}
        </span>
      </div>
      <button
        className="icon-button sidebar-exit"
        type="button"
        onClick={handleLogout}
        title="Cerrar sesion"
      >
        Salir
      </button>
    </nav>
  );
}

export default Navbar;
