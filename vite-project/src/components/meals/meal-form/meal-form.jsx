import { useState } from "react";

const today = new Date().toISOString().slice(0, 10);

function MealForm({ onSubmit, submitLabel = "Guardar comida" }) {
  const [form, setForm] = useState({
    date: today,
    name: "",
    calories: "",
    protein: "",
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein),
    });
  };

  return (
    <form className="panel-form" onSubmit={handleSubmit}>
      <label>
        Fecha
        <input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} required />
      </label>
      <label>
        Nombre comida
        <input value={form.name} onChange={(event) => update("name", event.target.value)} required />
      </label>
      <label>
        Calorias
        <input type="number" min="0" value={form.calories} onChange={(event) => update("calories", event.target.value)} required />
      </label>
      <label>
        Proteinas
        <input type="number" min="0" step="0.1" value={form.protein} onChange={(event) => update("protein", event.target.value)} required />
      </label>
      <button className="primary-button" type="submit">{submitLabel}</button>
    </form>
  );
}

export default MealForm;
