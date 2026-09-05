import { useState } from "react";
import { Link, useNavigate } from "react-router";
import * as ApiService from "../../../services/api-services";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [objective, setObjective] = useState("maintain");
  const [initialWeight, setInitialWeight] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ApiService.signup({
        name,
        email,
        password,
        objective,
        initialWeight: Number(initialWeight),
      });
      await ApiService.login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label>
        Contrasena
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="6" required />
      </label>
      <label>
        Peso inicial
        <input type="number" min="0" step="0.1" value={initialWeight} onChange={(event) => setInitialWeight(event.target.value)} required />
      </label>
      <label>
        Objetivo
        <select value={objective} onChange={(event) => setObjective(event.target.value)}>
          <option value="lose-weight">Perder peso</option>
          <option value="gain-muscle">Ganar músculo</option>
          <option value="maintain">Mantener</option>
        </select>
      </label>
      {error && <p className="error">{error}</p>}
      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Creando..." : "Registrarse"}
      </button>
      <p className="muted-link">
        Ya tienes cuenta? <Link to="/login">Entra</Link>
      </p>
    </form>
  );
}

export default RegisterForm;

//