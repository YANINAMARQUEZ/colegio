import './style.css'
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"

// Definición del tipo Student
type Student = { 
  id: number
  name: string
  email: string
  grade: string
  status: 'Activo' | 'Pendiente'
  joined: string
}

// Componente principal
function students() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar alumnos desde la API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/students`)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener alumnos")
        return res.json()
      })
      .then(data => {
        setStudents(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("No se pudo obtener la lista de alumnos")
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Cargando alumnos...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Lista de alumnos</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Grado</th>
            <th>Estado</th>
            <th>Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.grade}</td>
              <td>{s.status}</td>
              <td>{s.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Renderizar en el root
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Products />
  </React.StrictMode>
)
