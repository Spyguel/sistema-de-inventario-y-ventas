// Importar módulos necesarios
const express = require('express');
const morgan = require('morgan');
const pool = require('./db');
const cors = require('cors');
const { register, login } = require('./Routes/auth.routes');
const { usuarios, postUsuario, putUsuarios, toggleUserStatusOrDelete } = require('./Controllers/usersController');
const { contacto, postcontacto, deletecontacto, putcontacto, getcontactoItem, getContactosMovimiento } = require('./Controllers/ContactController');
const { 
  getItems, 
  getItemsTipo, 
  getItemsMovimiento, 
  getItemsProveedor, 
  createItem, 
  updateItem, 
  toggleItemStatus, 
  getMateriaPrimaActivos, 
  createOrUpdateComposition, 
  getComposersByItem,
  getItemsBajoStock // 🔹 Se agrega la función para obtener productos con bajo stock
} = require('./Controllers/itemsController');
const { getContactoItems, createContactoItem, checkRelationExists, getContactoItemsByContacto, deleteContactoItem, items_contactos_listos } = require('./Controllers/ContactoItemController.js');
const { roles, postroles, putroles, deleteroles, postAgregarPermiso } = require('./Controllers/rolesController');
const { Permisos, PostPermisos, PutPermisos, DeletePermisos } = require('./Controllers/permisosController');
const { Rolper, postRolPer } = require('./Controllers/rolPermisoController');
const { UsuarioRol } = require('./Controllers/usersRolController');
const { Movimientos, toggleMovStatus, createMovimiento } = require('./Controllers/movimientosController.js');

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
app.get('/usuarios', usuarios);
app.post('/usuarios', postUsuario);
app.put('/usuarios/:id', putUsuarios);
app.delete('/usuarios/:id', toggleUserStatusOrDelete);

// ─── RUTAS CONTACTO ─────────────────────────────────────────────
app.get('/contacto', contacto);
app.post('/contacto', postcontacto);
app.delete('/contacto/:id', deletecontacto);
app.put('/contacto/:id', putcontacto);
app.get('/contacto_item', getcontactoItem);
app.get('/contacto_movimiento', getContactosMovimiento);

// ─── RUTAS ITEM ─────────────────────────────────────────────
app.get('/items', getItems);
app.get('/items/bajo-stock', getItemsBajoStock); // <-- Primero
app.get('/items/:tipo', getItemsTipo);           // <-- Después
app.get('/items_movimiento', getItemsMovimiento);
app.get('/items_proveedor', getItemsProveedor);
app.post('/items', createItem);
app.put('/items/:id', updateItem);
app.put('/items/:id/toggle', toggleItemStatus);
app.get('/items/materia-prima-activos', getMateriaPrimaActivos);
app.post('/composicion_item', createOrUpdateComposition);
app.get('/item_composicion/:id', getComposersByItem);


// ─── RUTAS DE CONTACTO_ITEM ─────────────────────────────────────────────
app.get('/contacto_item', getContactoItems);
app.get('/contacto_item/contacto/:id_contacto', getContactoItemsByContacto);
app.get('/contacto_item/check-relation/:id_contacto/:id_item', checkRelationExists);
app.post('/contacto_item', createContactoItem);
app.delete('/contacto_item/:id_contacto/:id_item', deleteContactoItem);
app.get('/contacto_item/items_contactos_listos', items_contactos_listos);

// ─── RUTAS ROL ─────────────────────────────────────────────
app.get('/roles', roles);
app.post('/roles', postroles);
app.put('/roles/:id', putroles);
app.delete('/roles/:id', deleteroles);
app.post('/roles/:id/permisos', postAgregarPermiso);

// ─── RUTAS PERMISOS ─────────────────────────────────────────────
app.get('/permisos', Permisos);
app.post('/postPermisos', PostPermisos);
app.put('/permisos/:id', PutPermisos);
app.delete('/permisos/:id', DeletePermisos);

// ─── RUTAS ROL-PERMISO ─────────────────────────────────────────────
app.get('/RolPer', Rolper);
app.post('/RolPer', postRolPer);

// ─── RUTAS DE USUARIO_ROL ─────────────────────────────────────────────
app.post('/UsuarioRol', UsuarioRol);

// ─── RUTAS DE AUTENTICACIÓN ─────────────────────────────────────────────
app.use('/auth', router);

// ─── RUTAS DE MOVIMIENTOS ─────────────────────────────────────────────
app.get('/movimientos', Movimientos);
app.delete('/movimientos/:id', toggleMovStatus);
app.post('/movimientos', createMovimiento);

// Configuración del servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
