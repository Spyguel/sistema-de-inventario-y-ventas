const pool = require('../db'); // Conexión a la BD

// Función para obtener todas las relaciones contacto-ítem
const getContactoItems = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacto_item');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las relaciones:', err);
        res.status(500).json({ message: 'Error al obtener las relaciones' });
    }
};

// Función para obtener las relaciones de un contacto específico
const getContactoItemsByContacto = async (req, res) => {
    const { id_contacto } = req.params;
    try {
        const result = await pool.query('SELECT id_item FROM contacto_item WHERE id_contacto = $1', [id_contacto]);
        const itemsAsociados = result.rows.map(row => row.id_item);
        res.status(200).json({ items: itemsAsociados });
    } catch (err) {
        console.error('Error al obtener las relaciones de contacto:', err);
        res.status(500).json({ message: 'Error al obtener las relaciones del contacto' });
    }
};

// Función para verificar si ya existe una relación entre un contacto y un ítem
const checkRelationExists = async (req, res) => {
    const { id_contacto, id_item } = req.params;
    try {
        const result = await pool.query(
            'SELECT 1 FROM contacto_item WHERE id_contacto = $1 AND id_item = $2',
            [id_contacto, id_item]
        );
        const exists = result.rows.length > 0;
        res.status(200).json({ exists });
    } catch (err) {
        console.error('Error al verificar la relación:', err);
        res.status(500).json({ message: 'Error al verificar la relación' });
    }
};

// Función para crear una nueva relación contacto-ítem
const createContactoItem = async (req, res) => {
    const { id_contacto, id_item } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO contacto_item (id_contacto, id_item) VALUES ($1, $2) RETURNING id_contacto_item',
            [id_contacto, id_item]
        );
        res.status(201).json({ id_contacto_item: result.rows[0].id_contacto_item });
    } catch (err) {
        console.error('Error al crear la relación:', err);
        res.status(500).json({ message: 'Error al crear la relación contacto-ítem' });
    }
};

// Función para eliminar una relación específica entre un contacto y un ítem
const deleteContactoItem = async (req, res) => {
    const { id_contacto, id_item } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM contacto_item WHERE id_contacto = $1 AND id_item = $2',
            [id_contacto, id_item]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Relación no encontrada' });
        }
        res.status(200).json({ message: 'Relación eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la relación:', err);
        res.status(500).json({ message: 'Error al eliminar la relación' });
    }
};

// Función para obtener los contactos e ítems listos y agrupados según el tipo de contacto
const items_contactos_listos = async (req, res) => {
    try {
      const query = `
        (
          SELECT c.id_contacto, c.nombre AS nombre_contacto, c.tipo_contacto, c.activo AS contacto_activo,i.id_item, i.unidad_medida, i.nombre AS nombre_item, i.tipo_item, i.cantidad_actual, i.cantidad_minima, NULL AS fecha_creacion, i.activo AS item_activo
          FROM contacto c
          INNER JOIN contacto_item ci ON ci.id_contacto = c.id_contacto
          INNER JOIN item i ON i.id_item = ci.id_item
          WHERE c.activo = true AND i.activo = true AND c.tipo_contacto = 'Proveedor'
        )
        UNION ALL
        (
          SELECT c.id_contacto, c.nombre AS nombre_contacto, c.tipo_contacto, c.activo AS contacto_activo,i.id_item, i.unidad_medida, i.nombre AS nombre_item, i.tipo_item, i.cantidad_actual, i.cantidad_minima, i.fecha_creacion, i.activo AS item_activo
          FROM contacto c  
          CROSS JOIN item i
          WHERE c.activo = true AND c.tipo_contacto = 'Cliente' AND i.activo = true AND i.tipo_item = 'Producto Terminado'
        );
      `;
  
      const result = await pool.query(query);
  
      // Mapas para agrupar contactos e ítems por tipo de contacto
      const proveedoresMap = {};
      const clientesMap = {};
  
      result.rows.forEach(row => {
        if (row.tipo_contacto === 'Proveedor') {
          if (!proveedoresMap[row.id_contacto]) {
            proveedoresMap[row.id_contacto] = {
              contacto: {
                id_contacto: row.id_contacto,
                nombre: row.nombre_contacto,
                tipo_contacto: row.tipo_contacto,
                activo: row.contacto_activo
              },
              items: []
            };
          }
          proveedoresMap[row.id_contacto].items.push({
            id_item: row.id_item,
            unidad_medida: row.unidad_medida,
            nombre: row.nombre_item,
            tipo_item: row.tipo_item,
            cantidad_actual: row.cantidad_actual,
            cantidad_minima: row.cantidad_minima,
            fecha_creacion: row.fecha_creacion,
            activo: row.item_activo
          });
        } else if (row.tipo_contacto === 'Cliente') {
          if (!clientesMap[row.id_contacto]) {
            clientesMap[row.id_contacto] = {
              contacto: {
                id_contacto: row.id_contacto,
                nombre: row.nombre_contacto,
                tipo_contacto: row.tipo_contacto,
                activo: row.contacto_activo
              },
              items: []
            };
          }
          clientesMap[row.id_contacto].items.push({
            id_item: row.id_item,
            unidad_medida: row.unidad_medida,
            nombre: row.nombre_item,
            tipo_item: row.tipo_item,
            cantidad_actual: row.cantidad_actual,
            cantidad_minima: row.cantidad_minima,
            fecha_creacion: row.fecha_creacion,
            activo: row.item_activo
          });
        }
      });
  
      const proveedores = Object.values(proveedoresMap);
      const clientes = Object.values(clientesMap);
  
      res.status(200).json({ proveedores, clientes });
    } catch (err) {
      console.error('Error al obtener items y contactos listos:', err);
      res.status(500).json({ message: 'Error al obtener los datos de items y contactos' });
    }
  };

module.exports = {
    getContactoItems,
    getContactoItemsByContacto,
    checkRelationExists,
    createContactoItem,
    deleteContactoItem,
    items_contactos_listos
};