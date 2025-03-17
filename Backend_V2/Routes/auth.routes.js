const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Esquema de validación con Joi
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roleId: Joi.number().integer().required()
});

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.ID_usuario, email: user.email, roleId: user.ID_rol },
    'clave_secreta',
    { expiresIn: '1h' }
  );
};

// Registrar usuario
const register = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, roleId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO public."USUARIO" ("ID_rol", email, "contraseña", activo) VALUES ($1, $2, $3, $4) RETURNING *',
      [roleId, email, hashedPassword, true]
    );

    const token = generateToken(result.rows[0]);
    res.status(201).json({ message: 'Usuario registrado', user: result.rows[0], token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT 
          u."ID_usuario", 
          u."ID_rol", 
          u.email, 
          u."contraseña", 
          u.activo, 
          r.nombre AS rol_nombre,
          ARRAY_AGG(p."Nombre") AS permisos
       FROM public."USUARIO" u
       JOIN public."ROL" r ON u."ID_rol" = r."ID_rol"
       LEFT JOIN public."ROL_PERMISO" rp ON r."ID_rol" = rp."ID_rol"
       LEFT JOIN public."PERMISOS" p ON rp."ID_permiso" = p."ID_permiso"
       WHERE u.email = $1
       GROUP BY u."ID_usuario", u."ID_rol", u.email, u."contraseña", u.activo, r.nombre`,
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.contraseña);

    if (!isValidPassword)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = generateToken(user);
    
    res.json({ 
      message: 'Autenticación exitosa', 
      token, 
      rol: user.rol_nombre,
      permisos: user.permisos || [],  // Si no tiene permisos, enviamos un array vacío
      userId: user.ID_usuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = { register, login };
