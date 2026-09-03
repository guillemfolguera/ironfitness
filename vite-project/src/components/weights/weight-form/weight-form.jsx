import { useState } from "react";

const today = new Date().toISOString().slice(0, 10);

function WeightForm({ onSubmit }) {
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ date, weight: Number(weight) });
    setWeight("");
  };

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      <input type="number" min="0" step="0.1" placeholder="Peso actual" value={weight} onChange={(event) => setWeight(event.target.value)} required />
      <button className="primary-button" type="submit">Añadir peso</button>
    </form>
  );
}

export default WeightForm;
