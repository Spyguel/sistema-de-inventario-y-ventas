require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json()); // Middleware para leer JSON en requests

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Ruta para registrar un usuario
app.post("/registro", async (req, res) => {
  try {
    const { id_rol, email, contraseña } = req.body;

    // Validar que los datos estén presentes
    if (!id_rol || !email || !contraseña) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar usuario en la base de datos
    const query = `
      INSERT INTO USUARIO (ID_rol, Email, Contraseña, Activo)
      VALUES ($1, $2, $3, TRUE) RETURNING *;
    `;
    const values = [id_rol, email, hashedPassword];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Usuario registrado", usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
