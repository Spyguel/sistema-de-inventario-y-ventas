// Importar módulos necesarios
const express = require('express');
const morgan = require('morgan');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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

// ruta para obtener los contactos 
app.get('/contacto', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.contacto');
        
        // Opcionalmente: transformar los nombres de campos con acentos a versiones sin acentos
        const contactos = result.rows.map(contacto => ({
            id_contacto: contacto.id_contacto, nombre: contacto.nombre, tipo_contacto: contacto.tipo_contacto, direccion: contacto.dirección, telefono: contacto.teléfono, mail: contacto.mail, activo: contacto.activo
        }));
        
        res.status(200).json(contactos);
        console.log('✅ Contactos obtenidos correctamente:', JSON.stringify(contactos, null, 2));
    } catch (error) {
        console.error('❌ Error al obtener contactos:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
});

app.post('/contacto', async (req, res) => {
    try {
        console.log(req.body);
        
        // Corregir la desestructuración para usar los nombres como vienen en el request
        const { nombre, tipo_contacto, direccion, telefono, mail } = req.body;
        
        // Usar las variables correctas en el query pero mantener los nombres con tilde en la consulta SQL
        const result = await pool.query(
            'INSERT INTO public.contacto (nombre, tipo_contacto, "dirección", "teléfono", mail, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nombre, tipo_contacto, direccion, telefono, mail, true]
        );
         
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error al crear contacto:', error); // Log para backend
        res.status(500).json({ error: `Error al crear el contacto: ${error.message}` }); // Devolver mensaje de error detallado
    }
});

// Ruta para eliminar un contacto
app.delete('/contacto/:id', async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        
        // Verificar si el contacto tiene movimientos asociados
        const movimientosResult = await client.query(
            'SELECT COUNT(*) FROM public.movimiento WHERE id_contacto = $1',
            [id]
        );
        
        const tieneMovimientos = parseInt(movimientosResult.rows[0].count) > 0;
        
        if (tieneMovimientos) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: 'No se puede eliminar el contacto porque tiene movimientos asociados',
                tieneMovimientos: true
            });
        }
        
        // Si no tiene movimientos, proceder con la eliminación
        const deleteResult = await client.query(
            'DELETE FROM public.contacto WHERE id_contacto = $1 RETURNING *',
            [id]
        );
        
        if (deleteResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }
        
        await client.query('COMMIT');
        res.status(200).json({ 
            message: 'Contacto eliminado correctamente',
            contactoEliminado: deleteResult.rows[0]
        });
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error al eliminar contacto:', error);
        res.status(500).json({ error: `Error al eliminar el contacto: ${error.message}` });
    } finally {
        client.release();
    }
});

// Ruta para actualizar un contacto (corregida)
app.put('/contacto/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Validar que id sea un número válido
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID del contacto no válido' });
        }
        
        // Corregida la desestructuración para usar los nombres del frontend
        const { nombre, tipo_contacto, direccion, telefono, mail, activo } = req.body;
        
        console.log('Actualizando contacto:', { id, nombre, tipo_contacto, direccion, telefono, mail, activo });
        
        const result = await pool.query(
            'UPDATE public.contacto SET nombre = $1, tipo_contacto = $2, "dirección" = $3, "teléfono" = $4, mail = $5, activo = $6 WHERE id_contacto = $7 RETURNING *',
            [nombre, tipo_contacto, direccion, telefono, mail, activo, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        
        // Transformar el resultado para mantener consistencia con el frontend
        const contactoActualizado = {
            id_contacto: result.rows[0].id_contacto,
            nombre: result.rows[0].nombre,
            tipo_contacto: result.rows[0].tipo_contacto,
            direccion: result.rows[0].dirección,
            telefono: result.rows[0].teléfono,
            mail: result.rows[0].mail,
            activo: result.rows[0].activo
        };
        
        res.status(200).json(contactoActualizado);
    } catch (error) {
        console.error('❌ Error al actualizar contacto:', error);
        res.status(500).json({ error: `Error al actualizar el contacto: ${error.message}` });
    }
});

app.get('/contacto_item', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.contacto_item');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('❌ Error al obtener contactos:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
});

// Configuración del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
