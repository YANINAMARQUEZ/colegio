 import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Conexión a MySQL (Railway interno)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// ------------------ RUTAS ------------------

// Students
app.get("/api/students", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM students");
  res.json(rows);
});

app.post("/api/students", async (req, res) => {
  const { name, email, grade } = req.body;
  const [result] = await pool.query(
    "INSERT INTO students (name, email, grade) VALUES (?, ?, ?)",
    [name, email, grade]
  );
  res.json({ id: result.insertId, name, email, grade });
});

// Courses
app.get("/api/courses", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM courses");
  res.json(rows);
});

app.post("/api/courses", async (req, res) => {
  const { title, description, start_date, end_date } = req.body;
  const [result] = await pool.query(
    "INSERT INTO courses (title, description, start_date, end_date) VALUES (?, ?, ?, ?)",
    [title, description, start_date, end_date]
  );
  res.json({ id: result.insertId, title, description, start_date, end_date });
});

// Enrollments
app.get("/api/enrollments", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM enrollments");
  res.json(rows);
});

app.post("/api/enrollments", async (req, res) => {
  const { student_id, course_id } = req.body;
  const [result] = await pool.query(
    "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
    [student_id, course_id]
  );
  res.json({ id: result.insertId, student_id, course_id });
});

// Orders
app.get("/api/orders", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM orders");
  res.json(rows);
});

app.post("/api/orders", async (req, res) => {
  const { student_id, total } = req.body;
  const [result] = await pool.query(
    "INSERT INTO orders (student_id, total) VALUES (?, ?)",
    [student_id, total]
  );
  res.json({ id: result.insertId, student_id, total });
});

// Users
app.get("/api/users", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

app.post("/api/users", async (req, res) => {
  const { username, password, role } = req.body;
  const [result] = await pool.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role]
  );
  res.json({ id: result.insertId, username, role });
});

// ------------------ SERVER ------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
