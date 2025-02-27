const pool = require('../db');

// En rolPermisoController.js
const Rolper = async (req, res) => {
    res.send('Ruta /RolPer funcionando, pero usa POST para enviar datos.');
};

const postRolPer = async (req, res) => {
    try {
        console.log("Datos recibidos en /RolPer:", req.body);
        const { idRol, permisos } = req.body;
    
        // Construcción de la consulta SQL
        const values = permisos.map(permisoId => `(${idRol}, ${permisoId})`).join(',');
        const query = `INSERT INTO public."ROL_PERMISO" ("ID_rol", "ID_permiso") VALUES ${values} RETURNING *`;
    
        console.log('Consulta SQL:', query);
    
        // Ejecución de la consulta
        const result = await pool.query(query);
        console.log('Inserción exitosa:', result.rows);
    
        res.status(201).json(result.rows);
      } catch (error) {
        console.error('Error en /RolPer:', error);
        res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
      }
}

module.exports = {
    Rolper,
    postRolPer
};