// Importar módulos necesarios
const express = require('express');
const morgan = require('morgan');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Configuración de la base de datos (sin .env)
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
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Esquema de validación con Joi para registro de usuario
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roleId: Joi.number().integer().required()
});

// Función para generar token JWT (se usa la propiedad real de la DB)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.ID_usuario, email: user.email, roleId: user.ID_rol },
    'clave_secreta',
    { expiresIn: '1h' }
  );
};

// ─── RUTAS USUARIO ─────────────────────────────────────────────

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

    const result = await pool.query(
      `SELECT u."ID_usuario", u."ID_rol", u.email, u."contraseña", u.activo, r.nombre AS rol_nombre
       FROM public."USUARIO" u
       JOIN public."ROL" r ON u."ID_rol" = r."ID_rol"
       WHERE u.email = $1`,
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
      rol: user.rol_nombre 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para listar usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u."ID_usuario", u.email, r.nombre AS rol, u.activo AS estado
       FROM public."USUARIO" u
       JOIN public."ROL" r ON u."ID_rol" = r."ID_rol"`
    );
    res.status(200).json({ usuarios: result.rows });
    console.log("USUARIOS OBTENIDOS :", result.rows)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ─── RUTAS CONTACTO ─────────────────────────────────────────────

app.get('/contacto', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.contacto');

    // Transformar nombres de campos si es necesario
    const contactos = result.rows.map(contacto => ({
      id_contacto: contacto.id_contacto,
      nombre: contacto.nombre,
      tipo_contacto: contacto.tipo_contacto,
      direccion: contacto.dirección,
      telefono: contacto.teléfono,
      mail: contacto.mail,
      activo: contacto.activo
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
    const { nombre, tipo_contacto, direccion, telefono, mail } = req.body;

    const result = await pool.query(
      'INSERT INTO public.contacto (nombre, tipo_contacto, "dirección", "teléfono", mail, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, tipo_contacto, direccion, telefono, mail, true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear contacto:', error);
    res.status(500).json({ error: `Error al crear el contacto: ${error.message}` });
  }
});

app.delete('/contacto/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;

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

app.put('/contacto/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID del contacto no válido' });
    }

    const { nombre, tipo_contacto, direccion, telefono, mail, activo } = req.body;
    console.log('Actualizando contacto:', { id, nombre, tipo_contacto, direccion, telefono, mail, activo });

    const result = await pool.query(
      'UPDATE public.contacto SET nombre = $1, tipo_contacto = $2, "dirección" = $3, "teléfono" = $4, mail = $5, activo = $6 WHERE id_contacto = $7 RETURNING *',
      [nombre, tipo_contacto, direccion, telefono, mail, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

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

// ─── RUTAS ITEM ─────────────────────────────────────────────
// Se elimina la duplicidad. Conservamos una sola definición de GET /items

app.get('/items', async (req, res) => {
  try {
    const { tipo } = req.query;
    const query = `
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
      ${tipo ? "WHERE tipo_item = $1" : ""}
    `;

    const result = await pool.query(query, tipo ? [tipo === 'materia-prima' ? 'Materia Prima' : 'Producto Terminado'] : []);
    const items = result.rows.map(item => ({
      ...item,
      fecha_creacion: new Date(item.fecha_creacion).toLocaleDateString('es-ES'),
      activo: item.activo ? 'Activo' : 'No activo'
    }));
    res.status(200).json({ items });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ─── RUTAS ROL ─────────────────────────────────────────────

// Obtener todos los roles
app.get('/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public."ROL"');
    res.status(200).json({ roles: result.rows });
    console.log("ROLES OBTENIDOS :", result.rows)
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
});

// Crear un nuevo rol (usa los campos "nombre" y "descripcion")
app.post('/roles', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const result = await pool.query(
      'INSERT INTO public."ROL" ("nombre", "descripcion") VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json({ message: 'Rol creado correctamente', rol: result.rows[0] });
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ error: 'Error al crear rol' });
  }
});

// Actualizar un rol existente
app.put('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const result = await pool.query(
      'UPDATE public."ROL" SET "nombre" = $1, "descripcion" = $2 WHERE "ID_rol" = $3 RETURNING *',
      [nombre, descripcion, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.status(200).json({ message: 'Rol actualizado correctamente', rol: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

// Eliminar un rol
app.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM public."ROL" WHERE "ID_rol" = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.status(200).json({ message: 'Rol eliminado correctamente', rol: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ error: 'Error al eliminar rol' });
  }
});

// Agregar un permiso a un rol mediante la tabla intermedia
app.post('/roles/:id/permisos', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_permiso } = req.body;
    const result = await pool.query(
      'INSERT INTO public."ROL_PERMISO" ("ID_rol", "ID_permiso") VALUES ($1, $2) RETURNING *',
      [id, id_permiso]
    );
    res.status(201).json({ message: 'Permiso agregado al rol correctamente', rolPermiso: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar permiso al rol:', error);
    res.status(500).json({ error: 'Error al agregar permiso al rol' });
  }
});

// ─── RUTAS PERMISOS ─────────────────────────────────────────────

// Obtener todos los permisos
app.get('/permisos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public."PERMISOS"');
    res.status(200).json({ permisos: result.rows });
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ error: 'Error al obtener permisos' });
  }
});

// Crear un nuevo permiso
app.post('/permisos', async (req, res) => {
  try {
    console.log(req.body);
    const { Nombre, descripcion, acceso } = req.body;
    const result = await pool.query(
      'INSERT INTO public."PERMISOS" ("Nombre", "descripcion", "acceso") VALUES ($1, $2, $3) RETURNING *',
      [Nombre, descripcion, acceso]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear permiso:', error);
    res.status(500).json({ error: 'Error al crear permiso' });
  }
});

// Actualizar un permiso existente (usando SQL en lugar de un modelo ORM)
app.put('/permisos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, descripcion, acceso } = req.body;
    const result = await pool.query(
      'UPDATE public."PERMISOS" SET "Nombre" = $1, "descripcion" = $2, "acceso" = $3 WHERE "ID_permiso" = $4 RETURNING *',
      [Nombre, descripcion, acceso, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }
    res.status(200).json({ message: 'Permiso actualizado correctamente', permiso: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar permiso:', error);
    res.status(500).json({ error: 'Error al actualizar permiso' });
  }
});

// Eliminar un permiso (con transacción para borrar también las relaciones en ROL_PERMISO)
app.delete('/permisos/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    console.log('ID recibido para eliminar: ', id);

    const permisoId = Number(id);
    if (isNaN(permisoId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await client.query('BEGIN');
    await client.query(
      'DELETE FROM public."ROL_PERMISO" WHERE "ID_permiso" = $1',
      [permisoId]
    );
    const result = await client.query(
      'DELETE FROM public."PERMISOS" WHERE "ID_permiso" = $1 RETURNING *',
      [permisoId]
    );
    if (result.rows.length === 0) {
      console.log('No se encontró ningún permiso con ese ID');
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }
    await client.query('COMMIT');
    res.status(200).json({ message: 'Permiso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar permiso:', error);
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error al eliminar permiso' });
  } finally {
    client.release();
  }
});


app.get('/RolPer', (req, res) => {
  res.send('Ruta /RolPer funcionando, pero usa POST para enviar datos.');
});


// Función para guardar un RolPermiso en la base de datos
app.post('/RolPer', async (req, res) => {
  try {
    console.log("Datos recibidos en /RolPer:", req.body);
    const { idRol, permisos } = req.body;

    // Construcción de la consulta SQL
    const values = permisos.map(permisoId => `(${idRol}, ${permisoId})`).join(',');
    const query = `INSERT INTO public."ROL_PERMISO" ("ID_rol", "ID_permiso") VALUES ${values} RETURNING *`;

    console.log('Consulta SQL:', query);

    // Ejecución de la consulta
    const result = await pool.query(query);
    console.log('Inserción exitosa:', result.rows);

    res.status(201).json(result.rows);
  } catch (error) {
    console.error('Error en /RolPer:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
});

app.post('/UsuarioRol', async (req, res) => {
  try {
    console.log("Datos recibidos en /UsuarioRol:", req.body);
    const { idUsuario, idRol } = req.body;

    const result = await pool.query(
      'UPDATE public."USUARIO" SET "ID_rol" = $1 WHERE "ID_usuario" = $2 RETURNING *',
      [idRol, idUsuario]
    );

    res.status(201).json(result.rows);
  } catch (error) {
    console.error('Error en /UsuarioRol:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
});


// Configuración del servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
