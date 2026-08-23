import { useState } from "react";
import * as ApiService from "../../../services/api-services";
import { useNavigate } from "react-router";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [objective, setObjective] = useState("maintain");
  const [initialWeight, setInitialWeight] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await ApiService.signup({
        name,
        email,
        password,
        objective,
        initialWeight: Number(initialWeight),
      });

      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label>Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Peso</label>
        <input
          type="number"
          value={initialWeight}
          onChange={(e) => setInitialWeight(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Objetivo</label>
        <select
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        >
          <option value="lose-weight">Perder peso</option>
          <option value="gain-muscle">Ganar músculo</option>
          <option value="maintain">Mantener</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit">Registrarse</button>
    </form>
  );
}

export default RegisterForm;
