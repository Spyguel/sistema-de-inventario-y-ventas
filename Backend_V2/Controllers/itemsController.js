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

// Crear nuevo ítem (versión final simplificada)
const createItem = async (req, res) => {
  try {
    const { 
      unidad_medida, 
      nombre, 
      tipo_item, 
      cantidad_actual, 
      cantidad_minima 
    } = req.body;

    // Validación de campos obligatorios (sin activo)
    if (!unidad_medida || !nombre || !tipo_item || cantidad_actual === undefined || cantidad_minima === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar tipo de ítem
    const tiposValidos = ['Materia Prima', 'Producto Terminado'];
    if (!tiposValidos.includes(tipo_item)) {
      return res.status(400).json({ error: 'Tipo de ítem no válido' });
    }

    // Insertar con activo siempre en true
    const result = await pool.query(
      `INSERT INTO public.item (
        unidad_medida, 
        nombre, 
        tipo_item, 
        cantidad_actual, 
        cantidad_minima, 
        activo,
        fecha_creacion
      ) VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP) 
      RETURNING *`,
      [
        unidad_medida,
        nombre,
        tipo_item,
        cantidad_actual,
        cantidad_minima
      ]
    );

    const newItem = formatItems(result.rows)[0];
    res.status(201).json(newItem);

  } catch (error) {
    console.error('Error al crear ítem:', error);
    res.status(500).json({ 
      error: error.message.includes('duplicate key') 
        ? 'El ítem ya existe' 
        : 'Error interno del servidor' 
    });
  }
};

module.exports = {
  getItems,
  getItemsTipo,
  getItemsMovimiento,
  createItem
};