import { useEffect, useState } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/students`)
      .then(res => setStudents(res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Lista de estudiantes</h1>
      <ul>
        {students.map((s: any) => (
          <li key={s.id}>{s.name} - {s.grade}</li>
        ))}
      </ul>
    </div>
  );
}

export default Students;
