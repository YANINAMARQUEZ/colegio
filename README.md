# Aula Norte

Proyecto pequeño de gestión escolar: directorio de alumnos con frontend Vite + TypeScript, backend Express y MySQL.

## Estructura

- `colegio-frontend/`: panel responsive para buscar, añadir y editar alumnos.
- `backend/`: API REST y conexión al pool de MySQL.
- `backend/database/schema.sql`: base de datos, tabla e información inicial.

## Arranque

1. Ejecuta `backend/database/schema.sql` en MySQL.
2. Copia `backend/.env.example` como `backend/.env` y completa la contraseña.
3. En `backend/`, ejecuta `npm install` y después `npm run dev`.
4. En `colegio-frontend/`, ejecuta `npm install` y después `npm run dev`.

La API expone `GET /api/health`, `GET /api/students`, `POST /api/students`, `PUT /api/students/:id` y `DELETE /api/students/:id`.
