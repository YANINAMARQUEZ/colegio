
import { useEffect, useState } from "react";
import api from "../api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", grade: "" });

  useEffect(() => {
    api.get("/students").then(res => setStudents(res.data));
  }, []);

  const addStudent = async () => {
    await api.post("/students", form);
    const res = await api.get("/students");
    setStudents(res.data);
    setForm({ name: "", email: "", grade: "" });
  };

  return (
    <div>
      <h2>Estudiantes</h2>
      <ul>
        {students.map(s => (
          <li key={s.id}>{s.name} - {s.grade}</li>
        ))}
      </ul>

      <h3>Agregar estudiante</h3>
      <input
        placeholder="Nombre"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Grado"
        value={form.grade}
        onChange={e => setForm({ ...form, grade: e.target.value })}
      />
      <button onClick={addStudent}>Guardar</button>
    </div>
  );
}
