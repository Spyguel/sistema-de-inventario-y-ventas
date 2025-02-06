// Importar módulos necesarios
const express = require('express');
const morgan = require('morgan');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Configuración de la base de datos sin .env
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sistema-inventario',
    password: 'password',
    port: 5432,
});

pool.connect()
    .then(client => {
        console.log('✅ Conexión exitosa a PostgreSQL');
        client.release(); // Liberar el cliente después de la prueba
    })
    .catch(err => {
        console.error('❌ Error al conectar a PostgreSQL:', err);
    });

    pool.query('SELECT NOW()')
    .then(res => console.log('📅 Hora actual en PostgreSQL:', res.rows[0].now))
    .catch(err => console.error('❌ Error en la consulta:', err));



// Inicializar Express
const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Esquema de validación con Joi
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    roleId: Joi.number().integer().required()
});

// Generar token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, roleId: user.id_rol }, 'clave_secreta', { expiresIn: '1h' });
};

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
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
});

// Ruta para autenticación de usuarios
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Consulta adaptada al estilo de tu ejemplo con los nombres de columnas de PostgreSQL
        const result = await pool.query(
            'SELECT "ID_usuario", "ID_rol", email, "contraseña", activo FROM public."USUARIO" WHERE email = $1', 
            [email]
        );

        if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.contraseña);

        if (!isValidPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = generateToken(user);
        res.json({ message: 'Autenticación exitosa', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Configuración del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
