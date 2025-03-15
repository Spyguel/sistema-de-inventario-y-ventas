const pool = require('../db');

// Función para formatear los ítems (reutilizable)
const formatItems = (items) => {
  return items.map(item => ({
    ...item,
    fecha_creacion: new Date(item.fecha_creacion).toLocaleDateString('es-ES'),
    activo: item.activo ? 'Activo' : 'No activo',
    alerta: item.cantidad_actual < item.cantidad_minima ? '⚠️ Stock bajo' : '✅ Stock suficiente'
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

const getItemsBajoStock = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.item WHERE cantidad_actual < cantidad_minima'
    );
    res.status(200).json({ items: formatItems(result.rows) });
  } catch (error) {
    console.error('Error al obtener ítems con stock bajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//Obtener los items para filtrarlos
const getItemsMovimiento = async (req, res) => {
  try {
      const query = `
          SELECT "id_item", "nombre", "tipo_item" FROM public.item WHERE "activo" = true`;
      const result = await pool.query(query);
      res.status(200).json({ items: result.rows });
  } catch (error) {
      console.error('Error al obtener ítems de movimiento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear nuevo ítem 
const createItem = async (req, res) => {
  try {
    const { unidad_medida, nombre, tipo_item, cantidad_minima } = req.body;

    // Validación de campos obligatorios (se elimina cantidad_actual, se asigna 0 por defecto)
    if (!unidad_medida || !nombre || !tipo_item || cantidad_minima === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar tipo de ítem
    const tiposValidos = ['Materia Prima', 'Producto Terminado'];
    if (!tiposValidos.includes(tipo_item)) {
      return res.status(400).json({ error: 'Tipo de ítem no válido' });
    }

    // Insertar con activo siempre en true y cantidad_actual en 0
    const result = await pool.query(
      `INSERT INTO public.item (unidad_medida, nombre, tipo_item, cantidad_actual, cantidad_minima, activo, fecha_creacion) 
       VALUES ($1, $2, $3, 0, $4, true, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [
        unidad_medida,
        nombre,
        tipo_item,
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

// Actualizar un ítem existente
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Extraemos los campos enviados; si falta alguno, se toman los valores actuales de la base de datos
    const { unidad_medida, nombre, tipo_item, cantidad_minima, id_composicion } = req.body;
    
    // Primero obtenemos el item actual
    const currentResult = await pool.query('SELECT * FROM public.item WHERE id_item = $1', [id]);
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ítem no encontrado' });
    }
    const currentItem = currentResult.rows[0];
    
    // Actualizamos usando los valores nuevos o los actuales
    const result = await pool.query(
      `UPDATE public.item 
       SET unidad_medida = $1, nombre = $2, tipo_item = $3, cantidad_minima = $4, id_composicion = $5
       WHERE id_item = $6 RETURNING *`,
      [
        unidad_medida || currentItem.unidad_medida,
        nombre || currentItem.nombre,
        tipo_item || currentItem.tipo_item,
        cantidad_minima !== undefined ? cantidad_minima : currentItem.cantidad_minima,
        id_composicion || currentItem.id_composicion,
        id
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar ítem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Alternar el estado activo de un ítem usando NOT
const toggleItemStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar referencias en tablas relacionadas
    const referencesResult = await pool.query(
      `SELECT 
         (SELECT COUNT(*) FROM public.contacto_item WHERE id_item = $1) +
         (SELECT COUNT(*) FROM public.movimiento_item WHERE id_item = $1) 
       AS total_references`,
      [id]
    );

    const totalReferences = parseInt(referencesResult.rows[0].total_references, 10);

    if (totalReferences > 0) {
      // Si hay referencias, cambiar estado activo
      const updateResult = await pool.query(
        'UPDATE public.item SET activo = NOT activo WHERE id_item = $1 RETURNING *',
        [id]
      );

      if (updateResult.rows.length === 0) {
        return res.status(404).json({ error: 'Ítem no encontrado' });
      }

      const updatedItem = formatItems(updateResult.rows)[0];
      const message = updatedItem.activo 
        ? 'Ítem reactivado (existen referencias relacionadas)' 
        : 'Ítem desactivado (existen referencias relacionadas)';
      
      return res.status(200).json({ message, item: updatedItem });
    } else {
      // Si no hay referencias, eliminar permanentemente
      const deleteResult = await pool.query(
        'DELETE FROM public.item WHERE id_item = $1 RETURNING *',
        [id]
      );

      if (deleteResult.rows.length === 0) {
        return res.status(404).json({ error: 'Ítem no encontrado' });
      }

      const deletedItem = formatItems(deleteResult.rows)[0];
      return res.status(200).json({
        message: 'Ítem eliminado permanentemente (sin referencias)',
        item: deletedItem
      });
    }

  } catch (error) {
    console.error('Error al cambiar estado o eliminar ítem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener materia prima activa
const getMateriaPrimaActivos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.item WHERE tipo_item = $1 AND activo = true',
      ['Materia Prima']
    );
    res.status(200).json({ items: formatItems(result.rows) });
  } catch (error) {
    console.error('Error al obtener materia prima activa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear o actualizar la composición de un producto
const createOrUpdateComposition = async (req, res) => {
  console.log("Lo que llega al backend: ", req.body);

  const client = await pool.connect(); // Iniciar transacción manualmente con pool
  try {
    const { id_item, composicion } = req.body;

    if (!id_item || !Array.isArray(composicion)) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    await client.query('BEGIN'); // Iniciar la transacción

    // Verificar si el producto terminado existe
    const producto = await client.query(
      'SELECT * FROM public.item WHERE id_item = $1',
      [id_item]
    );

    if (producto.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'El producto terminado no existe' });
    }

    // Buscar composiciones existentes
    const composicionesExistentes = await client.query(
      'SELECT id_item, cantidad_usada FROM public.composicion_item WHERE id_item_final = $1',
      [id_item]
    );

    const composicionesMap = new Map(composicionesExistentes.rows.map(comp => [comp.id_item, comp]));

    // Procesar la nueva composición
    for (const comp of composicion) {
      const { id_item: idMateria, cantidad_usada } = comp;

      if (composicionesMap.has(idMateria)) {
        // Si ya existe, actualizar cantidad
        await client.query(
          'UPDATE public.composicion_item SET cantidad_usada = $1 WHERE id_item_final = $2 AND id_item = $3',
          [cantidad_usada, id_item, idMateria]
        );
      } else {
        // Si no existe, insertar nueva composición
        await client.query(
          'INSERT INTO public.composicion_item (id_item, cantidad_usada, id_item_final) VALUES ($1, $2, $3)',
          [idMateria, cantidad_usada, id_item]
        );
      }
    }

    await client.query('COMMIT'); // Confirmar la transacción

    return res.status(201).json({
      message: 'Composición guardada correctamente',
      id_item_final: id_item
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Revertir cambios si hay un error
    console.error('Error al guardar composición:', error);
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  } finally {
    client.release(); // Liberar conexión
  }
};

const getComposersByItem = async (req, res) => {
  console.log("Llega al backend: ", req.params);
  try {
    const { id } = req.params; 
    console.log("Buscando composición para id_item_final:", id);

    const result = await pool.query(
      'SELECT id_item, cantidad_usada FROM public.composicion_item WHERE id_item_final = $1',
      [id]
    );

    // Siempre devuelve un array (aunque esté vacío)
    return res.status(200).json({
      compositores: result.rows.map(comp => ({
        id_item: comp.id_item,
        cantidad_usada: comp.cantidad_usada
      }))
    });
  } catch (error) {
    console.error('Error al obtener compositores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getItemsProveedor = async (req, res) => {
  try {
    // Consulta SQL para obtener ítems activos y de tipo "Materia Prima"
    const query = `
      SELECT "id_item", "nombre" FROM public.item WHERE activo = true AND tipo_item = 'Materia Prima'`;

    // Ejecutar la consulta
    const result = await pool.query(query);
    console.log('Resultado de la consulta:', result.rows); 

    // Devolver los ítems en el formato esperado
    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error('Error al obtener ítems:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = {
  getItems,
  getItemsTipo,
  getItemsMovimiento,
  createItem,
  updateItem,
  toggleItemStatus,
  getMateriaPrimaActivos,
  createOrUpdateComposition,
  getComposersByItem,
  getItemsProveedor,
  getItemsBajoStock
};
