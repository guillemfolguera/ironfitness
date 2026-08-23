import { useState } from "react";
import * as ApiService from "../../../services/api-services";
import { useNavigate } from "react-router";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await ApiService.login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
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

      {error && <p className="error">{error}</p>}

      <button type="submit">Loguearse</button>
    </form>
  );
}

export default LoginForm;
