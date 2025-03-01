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
    
    // Mapeo de URLs a valores en base de datos
    const mapTipos = {
      'materia-prima': 'Materia Prima',
      'producto-terminado': 'Producto Terminado',
      'insumo': 'Insumo'
    };

    // Validar tipos permitidos
    const tiposValidos = Object.keys(mapTipos);
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo no válido' });
    }

    // Obtener valor para la consulta SQL
    const tipoItem = mapTipos[tipo];

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
    // Realiza la consulta para obtener los ítems
    const result = await pool.query('SELECT "id_item", "nombre", "tipo_item" FROM public.item');

    // Devuelve los ítems formateados
    res.status(200).json({ items: formatItems(result.rows) });
  } catch (error) {
    console.error('Error al obtener ítems de movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear nuevo ítem (versión final simplificada)
const createItem = async (req, res) => {
  try {
    const { 
      unidad_medida, 
      nombre, 
      tipo_item, 
      cantidad_actual, 
      cantidad_minima,
      activo // <- Añadir este campo
    } = req.body;

    // Añadir 'activo' a la consulta SQL (6to parámetro)
    const result = await pool.query(
      `INSERT INTO public.item (
        unidad_medida, 
        nombre, 
        tipo_item, 
        cantidad_actual, 
        cantidad_minima, 
        activo,
        fecha_creacion
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) 
      RETURNING *`,
      [
        unidad_medida,
        nombre,
        tipo_item,
        cantidad_actual,
        cantidad_minima,
        activo
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear ítem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

};

module.exports = {
  getItems,
  getItemsTipo,
  getItemsMovimiento,
  createItem
};