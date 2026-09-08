import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", grade: "" });

  const API_URL = import.meta.env.VITE_API_URL;

  // Obtener estudiantes
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/students`);
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar estudiantes");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear estudiante
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.grade) {
      setError("Completa todos los campos");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/students`, {
        name: formData.name,
        email: formData.email,
        grade: formData.grade,
        status: "Activo",
      });
      setFormData({ name: "", email: "", grade: "" });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear estudiante");
    }
  };

  // Eliminar estudiante
  const handleDeleteStudent = async (id) => {
    if (!window.confirm("¿Estás seguro?")) return;

    try {
      await axios.delete(`${API_URL}/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      setError("Error al eliminar estudiante");
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="students-container">
      <h1>Gestión de Estudiantes</h1>

      {error && <div className="error">{error}</div>}

      {/* Formulario */}
      <form className="student-form" onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Grado"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        />
        <button type="submit">Agregar Estudiante</button>
      </form>

      {/* Lista de estudiantes */}
      <div className="students-list">
        <h2>Lista de Estudiantes ({students.length})</h2>
        {students.length === 0 ? (
          <p>No hay estudiantes registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Grado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.grade}</td>
                  <td>{student.status}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Students;
