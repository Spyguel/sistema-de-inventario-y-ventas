const pool = require('../db');

// Función para formatear los ítems (reutilizable)
const formatItems = (items) => {
  return items.map(item => ({
    ...item,
    fecha_creacion: new Date(item.fecha_creacion).toLocaleDateString('es-ES'),
    activo: item.activo ? 'Activo' : 'No activo'
  }));
};

// Obtener todos los ítems
const getItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.item');
    res.status(200).json({ items: formatItems(result.rows) });
  } catch (error) {
    console.error('Error al obtener ítems:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener ítems por tipo
const getItemsTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    // Validar tipos permitidos
    const tiposValidos = ['materia-prima', 'producto-terminado'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de ítem no válido' });
    }

    // Mapear parámetro a valor de base de datos
    const tipoItem = tipo === 'materia-prima' 
      ? 'Materia Prima' 
      : 'Producto Terminado';

    const result = await pool.query(
      'SELECT * FROM public.item WHERE tipo_item = $1',
      [tipoItem]
    );

    res.status(200).json({ items: formatItems(result.rows) });
    
  } catch (error) {
    console.error('Error al filtrar ítems:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getItemsMovimiento = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT "id_item", "nombre", "tipo_item", "fecha_creacion", "activo" FROM public.item'
    );
    res.status(200).json({ items: formatItems(result.rows) });
  } catch (error) {
    console.error('Error al obtener ítems de movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getItems,
  getItemsTipo,
  getItemsMovimiento
};