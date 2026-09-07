import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mysql from 'mysql2/promise'

const app = express()
const port = Number(process.env.PORT || 3000)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aula_norte',
  waitForConnections: true,
  connectionLimit: 10,
})

app.use(cors({ origin: process.env.CORS_ORIGIN || 'https://colegio-frontend-tau.vercel.app/' }))
app.use(express.json())

const studentFields = 'id, name, email, grade, status, DATE_FORMAT(joined, \'%d %b %Y\') AS joined'

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ status: 'ok', database: 'connected' })
  } catch {
    response.status(503).json({ status: 'error', database: 'unavailable' })
  }
})

app.get('/api/students', async (request, response, next) => {
  try {
    const search = String(request.query.search || '').trim()
    const [rows] = await pool.query(`SELECT ${studentFields} FROM students WHERE name LIKE ? OR email LIKE ? OR grade LIKE ? ORDER BY created_at DESC`, [`%${search}%`, `%${search}%`, `%${search}%`])
    response.json(rows)
  } catch (error) { next(error) }
})

app.post('/api/students', async (request, response, next) => {
  try {
    const { name, email, grade, status = 'Activo' } = request.body
    if (!name || !email || !grade) return response.status(400).json({ message: 'name, email y grade son obligatorios' })
    const [result] = await pool.execute('INSERT INTO students (name, email, grade, status) VALUES (?, ?, ?, ?)', [name.trim(), email.trim(), grade, status])
    const [rows] = await pool.query(`SELECT ${studentFields} FROM students WHERE id = ?`, [result.insertId])
    response.status(201).json(rows[0])
  } catch (error) { next(error) }
})

app.put('/api/students/:id', async (request, response, next) => {
  try {
    const { name, email, grade, status } = request.body
    const [result] = await pool.execute('UPDATE students SET name = ?, email = ?, grade = ?, status = ? WHERE id = ?', [name?.trim(), email?.trim(), grade, status, request.params.id])
    if (!result.affectedRows) return response.status(404).json({ message: 'Alumno no encontrado' })
    const [rows] = await pool.query(`SELECT ${studentFields} FROM students WHERE id = ?`, [request.params.id])
    response.json(rows[0])
  } catch (error) { next(error) }
})

app.delete('/api/students/:id', async (request, response, next) => {
  try {
    const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [request.params.id])
    if (!result.affectedRows) return response.status(404).json({ message: 'Alumno no encontrado' })
    response.status(204).send()
  } catch (error) { next(error) }
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ message: error.code === 'ER_DUP_ENTRY' ? 'Ese correo ya está registrado' : 'Error interno del servidor' })
})

app.listen(port, () => console.log(`Aula Norte API escuchando en http://localhost:${port}`))
