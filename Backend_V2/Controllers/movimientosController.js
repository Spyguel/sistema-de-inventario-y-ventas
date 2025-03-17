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
      LEFT JOIN public.movimiento_item mi ON m.id_movimiento = mi.id_movimiento -- CORRECCIÓN AQUÍ
      LEFT JOIN public.item i ON mi.id_item = i.id_item
      ORDER BY m.fecha_mov DESC;

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
    await client.query('BEGIN');

    // 1. Insertar documento
    const docResult = await client.query(
      `INSERT INTO documento (tipo_documento, fecha, pdf, total)
       VALUES ($1, $2, $3, $4) RETURNING id_documento`,
      [tipo_documento, fecha, pdf, total]
    );
    const id_documento = docResult.rows[0].id_documento;

    // 2. Insertar cabecera de movimiento
    const movResult = await client.query(
      `INSERT INTO movimiento (id_usuario, id_contacto, fecha_mov, tipo_mov, razón, detalle)
       VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING id_movimiento`,
      [id_usuario, id_contacto, tipo_mov, razon, detalle]
    );
    const id_movimiento = movResult.rows[0].id_movimiento;

    // 3. Relación movimiento-documento
    await client.query(
      `INSERT INTO movimiento_documento (id_movimiento, id_documento)
       VALUES ($1, $2)`,
      [id_movimiento, id_documento]
    );

    // 4. Procesar items y lotes
    for (const id_item of id_items) {
      let cantidad = cantidades[id_item];
      
      // Aplicar signo negativo para salidas
      if (tipo_mov === 'SALIDA') {
        cantidad = -Math.abs(cantidad);
      }

      // Insertar movimiento_item
      await client.query(
        `INSERT INTO movimiento_item (id_item, id_movimiento, cantidad)
         VALUES ($1, $2, $3)`,
        [id_item, id_movimiento, cantidad]
      );

      // Actualizar stock
      await client.query(
        `UPDATE item 
         SET cantidad_actual = cantidad_actual + $1 
         WHERE id_item = $2`,
        [cantidad, id_item]
      );

      // Insertar lote
      const lote = lotes[id_item];
      await client.query(
        `INSERT INTO lote (id_item, numero_lote, fecha_creacion_llegada, fecha_vencimiento, activo)
         VALUES ($1, $2, NOW(), $3, true)`,
        [id_item, lote.numero, lote.fecha]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      id_movimiento,
      message: 'Movimiento creado exitosamente'
    });
  } catch (error) {
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
