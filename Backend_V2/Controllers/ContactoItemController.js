const pool = require('../db'); // Conexión a la BD

// Función para obtener todas las relaciones contacto-ítem
const getContactoItems = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM contacto_item');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error al obtener las relaciones:', err);
      res.status(500).json({ message: 'Error al obtener las relaciones' });
    }
  };
  
  // Función para obtener las relaciones de un contacto específico
  const getContactoItemsByContacto = async (req, res) => {
    const { id_contacto } = req.params;
    try {
      const result = await pool.query('SELECT * FROM contacto_item WHERE id_contacto = $1', [id_contacto]);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error al obtener las relaciones de contacto:', err);
      res.status(500).json({ message: 'Error al obtener las relaciones del contacto' });
    }
  };
  
  // Función para verificar si ya existe una relación entre un contacto y un ítem
  const checkRelationExists = async (req, res) => {
    const { id_contacto, id_item } = req.params;
    try {
      const result = await pool.query(
        'SELECT 1 FROM contacto_item WHERE id_contacto = $1 AND id_item = $2',
        [id_contacto, id_item]
      );
      const exists = result.rows.length > 0;
      res.status(200).json({ hasRelations: exists });
    } catch (err) {
      console.error('Error al verificar la relación:', err);
      res.status(500).json({ message: 'Error al verificar la relación' });
    }
  };
  
  // Función para crear una nueva relación contacto-ítem
  const createContactoItem = async (req, res) => {
    const { id_contacto, id_item } = req.body;
    try {
      // Insertar nueva relación
      const result = await pool.query(
        'INSERT INTO contacto_item (id_contacto, id_item) VALUES ($1, $2) RETURNING id_contacto_item',
        [id_contacto, id_item]
      );
      res.status(201).json({ id_contacto_item: result.rows[0].id_contacto_item });
    } catch (err) {
      console.error('Error al crear la relación:', err);
      res.status(500).json({ message: 'Error al crear la relación contacto-ítem' });
    }
  };
  
  // Función para actualizar una relación contacto-ítem
  const updateContactoItem = async (req, res) => {
    const { id_contacto_item } = req.params;
    const { id_contacto, id_item } = req.body;
    try {
      const result = await pool.query(
        'UPDATE contacto_item SET id_contacto = $1, id_item = $2 WHERE id_contacto_item = $3',
        [id_contacto, id_item, id_contacto_item]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Relación no encontrada' });
      }
  
      res.status(200).json({ message: 'Relación actualizada correctamente' });
    } catch (err) {
      console.error('Error al actualizar la relación:', err);
      res.status(500).json({ message: 'Error al actualizar la relación contacto-ítem' });
    }
  };
  
  // Función para eliminar todas las relaciones de un contacto
  const deleteContactoItemsByContacto = async (req, res) => {
    const { id_contacto } = req.params;
    try {
      const result = await pool.query('DELETE FROM contacto_item WHERE id_contacto = $1', [id_contacto]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'No se encontraron relaciones para eliminar' });
      }
  
      res.status(200).json({ message: 'Relaciones eliminadas correctamente' });
    } catch (err) {
      console.error('Error al eliminar las relaciones:', err);
      res.status(500).json({ message: 'Error al eliminar las relaciones' });
    }
  };
  
  module.exports = {
    getContactoItems,
    getContactoItemsByContacto,
    checkRelationExists,
    createContactoItem,
    updateContactoItem,
    deleteContactoItemsByContacto,
  };