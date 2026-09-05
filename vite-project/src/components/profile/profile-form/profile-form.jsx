import { useState } from "react";

function ProfileForm({ profile, onSubmit }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    objective: profile?.objective || "maintain",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="panel-form compact-form" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
      </label>
      <label>
        Objetivo
        <select value={form.objective} onChange={(event) => setForm((current) => ({ ...current, objective: event.target.value }))}>
          <option value="lose-weight">Perder peso</option>
          <option value="gain-muscle">Ganar músculo</option>
          <option value="maintain">Mantener</option>
        </select>
      </label>
      <button className="primary-button" type="submit">Guardar perfil</button>
    </form>
  );
}

export default ProfileForm;
