const pool = require('../db');

const roles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."ROL"');
        res.status(200).json({ roles: result.rows });
        console.log("ROLES OBTENIDOS :", result.rows)
      } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error al obtener roles' });
      }
}

const postroles = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const result = await pool.query(
          'INSERT INTO public."ROL" ("nombre", "descripcion") VALUES ($1, $2) RETURNING *',
          [nombre, descripcion]
        );
        res.status(201).json({ message: 'Rol creado correctamente', rol: result.rows[0] });
      } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({ error: 'Error al crear rol' });
      }
}

const putroles = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const result = await pool.query(
          'UPDATE public."ROL" SET "nombre" = $1, "descripcion" = $2 WHERE "ID_rol" = $3 RETURNING *',
          [nombre, descripcion, id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.status(200).json({ message: 'Rol actualizado correctamente', rol: result.rows[0] });
      } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ error: 'Error al actualizar rol' });
      }
}

const deleteroles = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
          'DELETE FROM public."ROL" WHERE "ID_rol" = $1 RETURNING *',
          [id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.status(200).json({ message: 'Rol eliminado correctamente', rol: result.rows[0] });
      } catch (error) {
        console.error('Error al eliminar rol:', error);
        res.status(500).json({ error: 'Error al eliminar rol' });
      }
}

const postAgregarPermiso = async (req,res) => {
    try {
        const { id } = req.params;
        const { id_permiso } = req.body;
        const result = await pool.query(
          'INSERT INTO public."ROL_PERMISO" ("ID_rol", "ID_permiso") VALUES ($1, $2) RETURNING *',
          [id, id_permiso]
        );
        res.status(201).json({ message: 'Permiso agregado al rol correctamente', rolPermiso: result.rows[0] });
      } catch (error) {
        console.error('Error al agregar permiso al rol:', error);
        res.status(500).json({ error: 'Error al agregar permiso al rol' });
      }
}

module.exports = {
    roles,
    postroles,
    putroles,
    deleteroles,
    postAgregarPermiso
};