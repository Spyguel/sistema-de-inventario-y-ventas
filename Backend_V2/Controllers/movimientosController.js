const pool = require('../db');

const Movimientos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          m.*, 
          u.email AS "usuario.email", 
          c.nombre AS "contacto.nombre", 
          i.nombre AS "item.nombre"
       FROM public."movimiento" m
       LEFT JOIN public."usuario" u ON m.ID_usuario = u.ID_usuario
       LEFT JOIN public."contacto" c ON m.ID_contacto = c.ID_contacto
       LEFT JOIN public."item" i ON m.ID_item = i.ID_item`
    );
    // Se devuelve la información en la propiedad "movimientos"
    res.status(200).json({ movimientos: result.rows });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const toggleMovStatus = async (req, res) => {
  try {
    const movId = parseInt(req.params.id);

    if (isNaN(movId)) {
      return res.status(400).json({ error: 'ID de movimiento no válido' });
    }

    const result = await pool.query(
      `UPDATE public."movimiento" 
       SET activo = NOT activo 
       WHERE "ID_movimiento" = $1 
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
