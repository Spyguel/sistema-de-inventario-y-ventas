const pool = require('../db');

const Permisos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."PERMISOS"');
        res.status(200).json({ permisos: result.rows });
      } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ error: 'Error al obtener permisos' });
      }
}

const PostPermisos = async (req, res) => {
    try {
        console.log(req.body);
        const { Nombre, descripcion, acceso } = req.body;
        const result = await pool.query(
          'INSERT INTO public."PERMISOS" ("Nombre", "descripcion", "acceso") VALUES ($1, $2, $3) RETURNING *',
          [Nombre, descripcion, acceso]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('❌ Error al crear permiso:', error);
        res.status(500).json({ error: 'Error al crear permiso' });
      }
}

const PutPermisos = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre, descripcion, acceso } = req.body;
        const result = await pool.query(
          'UPDATE public."PERMISOS" SET "Nombre" = $1, "descripcion" = $2, "acceso" = $3 WHERE "ID_permiso" = $4 RETURNING *',
          [Nombre, descripcion, acceso, id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Permiso no encontrado' });
        }
        res.status(200).json({ message: 'Permiso actualizado correctamente', permiso: result.rows[0] });
      } catch (error) {
        console.error('Error al actualizar permiso:', error);
        res.status(500).json({ error: 'Error al actualizar permiso' });
      }
}

const DeletePermisos = async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      console.log('ID recibido para eliminar: ', id);
  
      const permisoId = Number(id);
      if (isNaN(permisoId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }
  
      await client.query('BEGIN');
      await client.query(
        'DELETE FROM public."ROL_PERMISO" WHERE "ID_permiso" = $1',
        [permisoId]
      );
      const result = await client.query(
        'DELETE FROM public."PERMISOS" WHERE "ID_permiso" = $1 RETURNING *',
        [permisoId]
      );
      if (result.rows.length === 0) {
        console.log('No se encontró ningún permiso con ese ID');
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Permiso no encontrado' });
      }
      await client.query('COMMIT');
      res.status(200).json({ message: 'Permiso eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Error al eliminar permiso' });
    } finally {
      client.release();
    }
}

const rolPermiso = async (req, res) => {
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
    Permisos,
    PostPermisos,
    PutPermisos,
    DeletePermisos,
    rolPermiso
};