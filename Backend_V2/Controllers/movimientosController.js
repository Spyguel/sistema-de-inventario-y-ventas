const pool = require('../db');

const Movimientos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id_movimiento AS "ID",
        TO_CHAR(m.fecha_mov, 'YYYY-MM-DD') AS "Fecha",
        u.email AS "Usuario",
        COALESCE(c.nombre, 'Sin contacto') AS "Contacto",
        i.nombre AS "Item",
        m.tipo_mov AS "Tipo",
        mi.cantidad AS "Cantidad",
        m.razón AS "Razón",
        m.detalle AS "Detalle"
      FROM public.movimiento m
      LEFT JOIN public."USUARIO" u ON m.id_usuario = u."ID_usuario"
      LEFT JOIN public.contacto c ON m.id_contacto = c.id_contacto
      LEFT JOIN public.movimiento_item mi ON m.id_movimiento_item = mi.id_movimiento_item
      LEFT JOIN public.item i ON mi.id_item = i.id_item
      ORDER BY m.fecha_mov DESC
    `);

    res.status(200).json({ movimientos: result.rows });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: error.message
    });
  }
};

const toggleMovStatus = async (req, res) => {
  try {
    const movId = parseInt(req.params.id, 10);
    if (isNaN(movId)) {
      return res.status(400).json({ error: 'ID de movimiento no válido' });
    }
    const result = await pool.query(
      `UPDATE public."movimiento" 
       SET activo = NOT activo 
       WHERE id_movimiento = $1 
       RETURNING *`,
      [movId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createMovimiento = async (req, res) => {
  const {
    tipo_documento,
    fecha_documento,
    total,
    id_usuario,
    fecha_mov,
    tipo_mov,
    razon,
    detalle,
    id_item,
    cantidad, // Parámetro faltante (ej: cantidad del ítem)
    id_contacto
  } = req.body;

  try {
    const result = await pool.query(
      `SELECT insertar_movimiento_completo(
        $1, $2, $3,   
        $4, $5, $6, $7, $8, 
        $9, $10,       
        $11            
      ) AS id_movimiento`,
      [
        tipo_documento,
        fecha_documento,
        total,
        id_usuario,
        fecha_mov,
        tipo_mov,
        razon,
        detalle,
        id_item,
        cantidad, // <--- Parámetro faltante (ej: 100)
        id_contacto || null  
      ]
    );

    res.status(201).json({
      success: true,
      id_movimiento: result.rows[0].id_movimiento,
      message: 'Movimiento creado exitosamente'
    });

  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear movimiento',
      details: error.message
    });
  }
};

module.exports = {
  Movimientos,
  toggleMovStatus,
  createMovimiento
};
