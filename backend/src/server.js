import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import initDatabase from './init-db.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 3000)

// Pool de conexiones con DATABASE_URL de Railway
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // ejemplo: mysql://user:pass@host:port/dbname
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Middleware
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'https://colegio-frontend-tau.vercel.app',
    'http://localhost:5173' // para pruebas locales con Vite
  ]
}))
app.use(express.json())

// Inicializar base de datos al arrancar
await initDatabase(pool)

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection()
    await connection.query('SELECT 1')
    connection.release()
    res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    console.error('Health check error:', error.message)
    res.status(503).json({ status: 'error', database: 'unavailable', message: error.message })
  }
})

// ============== STUDENTS ==============
app.get('/api/students', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/students', async (req, res, next) => {
  try {
    const { name, email, grade, status = 'Activo' } = req.body
    if (!name || !email || !grade) {
      return res.status(400).json({ message: 'name, email y grade son obligatorios' })
    }
    const [result] = await pool.execute(
      'INSERT INTO students (name, email, grade, status) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim(), grade, status]
    )
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    next(error)
  }
})

// ============== COURSES ==============
app.get('/api/courses', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/courses', async (req, res, next) => {
  try {
    const { title, description, start_date, end_date } = req.body
    if (!title) {
      return res.status(400).json({ message: 'title es obligatorio' })
    }
    const [result] = await pool.execute(
      'INSERT INTO courses (title, description, start_date, end_date) VALUES (?, ?, ?, ?)',
      [title, description, start_date, end_date]
    )
    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    next(error)
  }
})

// ============== ENROLLMENTS ==============
app.get('/api/enrollments', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM enrollments ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/enrollments', async (req, res, next) => {
  try {
    const { student_id, course_id } = req.body
    if (!student_id || !course_id) {
      return res.status(400).json({ message: 'student_id y course_id son obligatorios' })
    }
    const [result] = await pool.execute(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, course_id]
    )
    const [rows] = await pool.query('SELECT * FROM enrollments WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    next(error)
  }
})

// ============== ORDERS ==============
app.get('/api/orders', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/orders', async (req, res, next) => {
  try {
    const { student_id, total } = req.body
    if (!student_id || !total) {
      return res.status(400).json({ message: 'student_id y total son obligatorios' })
    }
    const [result] = await pool.execute(
      'INSERT INTO orders (student_id, total) VALUES (?, ?)',
      [student_id, total]
    )
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    next(error)
  }
})

// ============== USERS ==============
app.get('/api/users', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/users', async (req, res, next) => {
  try {
    const { username, password, role = 'user' } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'username y password son obligatorios' })
    }
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    )
    const [rows] = await pool.query('SELECT id, username, role, created_at FROM users WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    next(error)
  }
})

// ============== ERROR HANDLER ==============
app.use((error, req, res, next) => {
  console.error('Error:', error.message)
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'El registro ya existe' })
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ message: 'Referencia inválida a otra tabla' })
  }
  res.status(500).json({ message: 'Error interno del servidor', error: error.message })
})

app.listen(port, () => {
  console.log(`🚀 Aula Norte API escuchando en puerto ${port}`)
})