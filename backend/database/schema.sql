CREATE DATABASE IF NOT EXISTS aula_norte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aula_norte;

CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  grade VARCHAR(40) NOT NULL,
  status ENUM('Activo', 'Pendiente') NOT NULL DEFAULT 'Activo',
  joined DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO students (name, email, grade, status, joined) VALUES
  ('Lucía Fernández', 'lucia.fernandez@aulanorte.edu', '3º Primaria', 'Activo', '2024-09-12'),
  ('Mateo Rojas', 'mateo.rojas@aulanorte.edu', '5º Primaria', 'Activo', '2024-09-09'),
  ('Sofía Mendoza', 'sofia.mendoza@aulanorte.edu', '1º Secundaria', 'Pendiente', '2024-09-08');
