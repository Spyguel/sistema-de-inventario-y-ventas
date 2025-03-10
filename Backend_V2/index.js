// Importar módulos necesarios
const express = require('express');
const morgan = require('morgan');
const pool = require('./db');
const cors = require('cors');
const { register, login} = require('./Routes/auth.routes');
const { usuarios, postUsuario ,putUsuarios, toggleUserStatusOrDelete } = require('./Controllers/usersController');
const { contacto, postcontacto, deletecontacto, putcontacto, getcontactoItem, getContactosMovimiento } = require('./Controllers/ContactController');
const { getItems, getItemsTipo, getItemsMovimiento, getItemsProveedor, createItem, updateItem, toggleItemStatus, getMateriaPrimaActivos, createOrUpdateComposition, getComposersByItem} = require('./Controllers/itemsController');
const {getContactoItems, createContactoItem, checkRelationExists, getContactoItemsByContacto, deleteContactoItem} = require('./Controllers/ContactoItemController.js')
const { roles, postroles, putroles, deleteroles, postAgregarPermiso } = require('./Controllers/rolesController');
const { Permisos , PostPermisos, PutPermisos, DeletePermisos } = require('./Controllers/permisosController');
const { Rolper, postRolPer} = require('./Controllers/rolPermisoController');
const { UsuarioRol} = require('./Controllers/usersRolController');
const { Movimientos, toggleMovStatus } = require('./Controllers/movimientosController.js');

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

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// ─── RUTAS USUARIO ─────────────────────────────────────────────

// Ruta para listar usuarios
app.get('/usuarios', usuarios);
app.post('/usuarios', postUsuario);
app.put('/usuarios/:id', putUsuarios);
app.delete('/usuarios/:id', toggleUserStatusOrDelete);


// ─── RUTAS CONTACTO ─────────────────────────────────────────────

app.get('/contacto',contacto);

app.post('/contacto',postcontacto);

app.delete('/contacto/:id', deletecontacto);

app.put('/contacto/:id',putcontacto);

app.get('/contacto_item',getcontactoItem);

app.get('/contacto_movimiento',getContactosMovimiento);

// ─── RUTAS ITEM ─────────────────────────────────────────────

app.get('/items', getItems );
app.get('/items/:tipo', getItemsTipo);
app.get('/items_movimiento', getItemsMovimiento);
app.get('/items_proveedor', getItemsProveedor)

app.post('/items', createItem);
app.put('/items/:id', updateItem);
app.put('/items/:id/toggle', toggleItemStatus);
app.get('/items/materia-prima-activos', getMateriaPrimaActivos);
app.post('/composicion_item', createOrUpdateComposition);
app.get('/item_composicion/:id', getComposersByItem);

// ─── RUTAS DE CONTACTO_ITEM ─────────────────────────────────────────────

// Ruta para obtener todas las relaciones contacto-ítem
app.get('/contacto_item', getContactoItems);
// Ruta para obtener las relaciones de un contacto específico
app.get('/contacto_item/contacto/:id_contacto', getContactoItemsByContacto);
// Ruta para verificar si ya existe una relación entre un contacto y un ítem
app.get('/contacto_item/check-relation/:id_contacto/:id_item', checkRelationExists);
// Ruta para crear una nueva relación contacto-ítem
app.post('/contacto_item', createContactoItem);
// Ruta para eliminar una relación específica entre un contacto y un ítem
app.delete('/contacto_item/:id_contacto/:id_item', deleteContactoItem);

// ─── RUTAS ROL ─────────────────────────────────────────────

// Obtener todos los roles
app.get('/roles', roles);

// Crear un nuevo rol (usa los campos "nombre" y "descripcion")
app.post('/roles', postroles);

// Actualizar un rol existente
app.put('/roles/:id', putroles);

// Eliminar un rol
app.delete('/roles/:id', deleteroles);

// Agregar un permiso a un rol mediante la tabla intermedia
app.post('/roles/:id/permisos', postAgregarPermiso);

// ─── RUTAS PERMISOS ─────────────────────────────────────────────

// Obtener todos los permisos
app.get('/permisos', Permisos);

// Crear un nuevo permiso
app.post('/postPermisos', PostPermisos);

// Actualizar un permiso existente (usando SQL en lugar de un modelo ORM)
app.put('/permisos/:id', PutPermisos);

// Eliminar un permiso (con transacción para borrar también las relaciones en ROL_PERMISO)
app.delete('/permisos/:id', DeletePermisos);

app.get('/RolPer', Rolper);

// Función para guardar un RolPermiso en la base de datos
app.post('/RolPer', postRolPer);

// ─── RUTAS DE USUARIO_ROL ─────────────────────────────────────────────

// funcion para cambiar el rol de un usuario 
app.post('/UsuarioRol', UsuarioRol);

// ─── RUTAS DE AUTENTICACIÓN ─────────────────────────────────────────────
app.use('/auth', router);

// ─── RUTAS DE MOVIMIENTOS ─────────────────────────────────────────────
app.get('/movimientos', Movimientos);
app.delete('/movimientos/:id', toggleMovStatus);


// Configuración del servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});