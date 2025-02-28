const pool = require('../db');

const Movimientos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         m.id_movimiento,
         m.fecha_mov,
         m.tipo_mov,
         m.cantidad,
         m.razón,
         m.detalle,
         u.email AS "USUARIO.email", 
         c.nombre AS "contacto.nombre", 
         i.nombre AS "item.nombre",
         d.pdf AS "documento.pdf"
       FROM public."movimiento" m
       LEFT JOIN public."USUARIO" u ON m.id_usuario = u."ID_rol"
       LEFT JOIN public."contacto" c ON m.id_contacto = c.id_contacto
       LEFT JOIN public."item" i ON m.id_movimiento_item = i.id_item
       LEFT JOIN public."documento" d ON m.id_movimiento_documento = d.id_documento`
    );
    res.status(200).json({ movimientos: result.rows });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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

module.exports = {
  Movimientos,
  toggleMovStatus,
};
