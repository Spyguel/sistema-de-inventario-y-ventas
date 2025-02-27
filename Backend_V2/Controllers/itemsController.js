const pool = require('../db');

const items = async (req, res) => {
    try {
        const { tipo } = req.query;
        const query = `
          SELECT 
            id_item, 
            unidad_medida, 
            nombre, 
            tipo_item, 
            cantidad_actual, 
            cantidad_minima, 
            fecha_creacion, 
            activo
          FROM 
            public.item
          ${tipo ? "WHERE tipo_item = $1" : ""}
        `;
    
        const result = await pool.query(query, tipo ? [tipo === 'materia-prima' ? 'Materia Prima' : 'Producto Terminado'] : []);
        const items = result.rows.map(item => ({
          ...item,
          fecha_creacion: new Date(item.fecha_creacion).toLocaleDateString('es-ES'),
          activo: item.activo ? 'Activo' : 'No activo'
        }));
        res.status(200).json({ items });
      } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
}

module.exports = {
    items,
};