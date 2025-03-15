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
  // Extrae los datos enviados desde el frontend.
  const {
    documento: { tipo_documento, fecha, total, pdf },
    id_usuario,
    tipo_mov,
    razon,
    detalle,
    id_contacto,
    id_items,
    cantidades,
    lotes
  } = req.body;

  const client = await pool.connect();

  try {
    // Inicia la transacción.
    await client.query('BEGIN');

    // 1. Insertar el documento y obtener su ID.
    const docResult = await client.query(
      `INSERT INTO documento (tipo_documento, fecha, pdf, total)
       VALUES ($1, $2, $3, $4) RETURNING id_documento`,
       [tipo_documento, fecha, pdf, total]
    );
    const id_documento = docResult.rows[0].id_documento;

    // 2. Insertar la cabecera del movimiento y obtener su ID.
    const movResult = await client.query(
      `INSERT INTO movimiento (id_usuario, id_contacto, fecha_mov, tipo_mov, razón, detalle)
       VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING id_movimiento`,
       [id_usuario, id_contacto, tipo_mov, razon, detalle]
    );
    const id_movimiento = movResult.rows[0].id_movimiento;

    // 3. Insertar la relación entre movimiento y documento.
    await client.query(
      `INSERT INTO movimiento_documento (id_movimiento, id_documento)
       VALUES ($1, $2)`,
       [id_movimiento, id_documento]
    );

    // 4. Recorrer cada ítem seleccionado para insertar en movimiento_item y en lote.
    for (let id_item of id_items) {
      const cantidad = cantidades[id_item];

      // Insertar el detalle del ítem.
      await client.query(
        `INSERT INTO movimiento_item (id_item, id_movimiento, cantidad)
         VALUES ($1, $2, $3)`,
         [id_item, id_movimiento, cantidad]
      );

      // Insertar los datos del lote para el ítem.
      const lote = lotes[id_item];
      await client.query(
        `INSERT INTO lote (id_item, numero_lote, fecha_creacion_llegada, fecha_vencimiento, activo)
         VALUES ($1, $2, NOW(), $3, true)`,
         [id_item, lote.numero, lote.fecha]
      );
    }

    // Finaliza la transacción.
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      id_movimiento,
      message: 'Movimiento creado exitosamente'
    });
  } catch (error) {
    // Revierte la transacción en caso de error.
    await client.query('ROLLBACK');
    console.error('Error al crear movimiento:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear movimiento',
      details: error.message
    });
  } finally {
    client.release();
  }
};


module.exports = {
  Movimientos,
  toggleMovStatus,
  createMovimiento
};
