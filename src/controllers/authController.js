const pool = require("../db/db");
const bcrypt = require("bcrypt");

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { email, password, rol } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      "SELECT * FROM USUARIO WHERE Email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario
    const newUser = await pool.query(
      "INSERT INTO USUARIO (ID_rol, email, contraseña, activo) VALUES ($1, $2, $3, $4) RETURNING *",
      [rol, email, hashedPassword, true]
    );

    res.status(201).json({ message: "Usuario registrado", user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await pool.query("SELECT * FROM USUARIO WHERE Email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].contraseña
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({ message: "Inicio de sesión exitoso", user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};