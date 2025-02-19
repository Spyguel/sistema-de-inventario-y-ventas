    // Importar módulos necesarios
    const express = require('express');
    const morgan = require('morgan');
    const { Pool } = require('pg');
    const bcrypt = require('bcrypt');
    const Joi = require('joi');
    const jwt = require('jsonwebtoken');
    const cors = require('cors');

<<<<<<< HEAD
    // Configuración de la base de datos sin .env
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'sistema-inventario',
        password: 'password',
        port: 5432,
=======
// Configuración de la base de datos sin .env
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sistema-inventario',
    password: '1234567',
    port: 5432,
});

pool.connect()
    .then(client => {
        console.log('✅ Conexión exitosa a PostgreSQL');
        client.release(); // Liberar el cliente después de la prueba
    })
    .catch(err => {
        console.error('❌ Error al conectar a PostgreSQL:', err);
>>>>>>> 70634a1e0c36c5637990b64a24caebd890167fc3
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

    app.use(cors({
        origin: 'http://localhost:5173', // Permite solicitudes desde este origen
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
        allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
    }));

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

            // Consulta modificada para obtener el nombre del rol
            const result = await pool.query(
                `SELECT u."ID_usuario", u."ID_rol", u.email, u."contraseña", u.activo, r."nombre" AS rol_nombre
                FROM public."USUARIO" u
                JOIN public."ROL" r ON u."ID_rol" = r."ID_rol"
                WHERE u.email = $1`,
                [email]
            );

            if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

            const user = result.rows[0];
            const isValidPassword = await bcrypt.compare(password, user.contraseña);

            if (!isValidPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

            const token = generateToken(user);
            res.json({ 
                message: 'Autenticación exitosa', 
                token, 
                rol: user.rol_nombre // Devuelve el nombre del rol
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Nueva ruta para listar usuarios
    app.get('/usuarios', async (req, res) => {
        try {
            // Consulta para obtener usuarios con su rol y estado
            const result = await pool.query(
                `SELECT 
                    u."ID_usuario",
                    u.email,
                    r.nombre AS rol,
                    u.activo AS estado
                FROM 
                    public."USUARIO" u
                JOIN 
                    public."ROL" r ON u."ID_rol" = r."ID_rol"`
            );

            // Devolver la lista de usuarios
            res.status(200).json({ usuarios: result.rows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Nueva ruta para consultar la tabla item con filtros
    // Ruta para consultar la tabla item con filtros
    app.get('/items', async (req, res) => {
        try {
            const { tipo } = req.query; // Obtener el parámetro "tipo" de la URL

            let filtroTipo;
            if (tipo === 'materia-prima') {
                filtroTipo = 'Materia Prima';
            } else if (tipo === 'producto-terminado') {
                filtroTipo = 'Producto Terminado';
            } else {
                // Si no se especifica el tipo, devolver todos los items
                filtroTipo = null;
            }

            // Consulta SQL base
            let query = `
                SELECT 
                    id_item, 
                    unidad_medida, 
                    nombre, 
                    tipo_item, 
                    cantidad_actual, 
                    cantidad_minima, 
                    fecha_creacion, 
                    activo
                FROM 
                    public.item
            `;

            // Aplicar filtro si se especificó un tipo
            if (filtroTipo) {
                query += ` WHERE tipo_item = $1`;
            }

            // Ejecutar la consulta
            const result = filtroTipo 
                ? await pool.query(query, [filtroTipo]) 
                : await pool.query(query);

            // Devolver los resultados en formato JSON
            res.status(200).json({ items: result.rows });
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Configuración del servidor
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });