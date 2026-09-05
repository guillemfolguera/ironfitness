import { useState } from "react";
import { Link, useNavigate } from "react-router";
import * as ApiService from "../../../services/api-services";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ApiService.login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label>
        Contrasena
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <p className="muted-link">
        No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </form>
  );
}

export default LoginForm;
