const pool = require('../db');

const contacto = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.contacto');
    
        // Transformar nombres de campos si es necesario
        const contactos = result.rows.map(contacto => ({
          id_contacto: contacto.id_contacto,
          nombre: contacto.nombre,
          tipo_contacto: contacto.tipo_contacto,
          direccion: contacto.dirección,
          telefono: contacto.teléfono,
          mail: contacto.mail,
          activo: contacto.activo
        }));
    
        res.status(200).json(contactos);
        console.log('✅ Contactos obtenidos correctamente:', JSON.stringify(contactos, null, 2));
      } catch (error) {
        console.error('❌ Error al obtener contactos:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
      }
}

const getContactosMovimiento = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_contacto, nombre, tipo_contacto
       FROM public."contacto"`
    );
    res.status(200).json({ contactos: result.rows });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



const postcontacto = async (req, res) => {
    try {
        console.log(req.body);
        const { nombre, tipo_contacto, direccion, telefono, mail } = req.body;
    
        const result = await pool.query(
          'INSERT INTO public.contacto (nombre, tipo_contacto, "dirección", "teléfono", mail, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [nombre, tipo_contacto, direccion, telefono, mail, true]
        );
    
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('❌ Error al crear contacto:', error);
        res.status(500).json({ error: `Error al crear el contacto: ${error.message}` });
      }
}

const deletecontacto = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;

    // Verificar si el contacto tiene movimientos asociados
    const movimientosResult = await client.query(
      'SELECT COUNT(*) FROM public.movimiento WHERE id_contacto = $1',
      [id]
    );
    const tieneMovimientos = parseInt(movimientosResult.rows[0].count) > 0;

    // Verificar si el contacto tiene ítems asociados en contacto_item
    const contactoItemResult = await client.query(
      'SELECT COUNT(*) FROM public.contacto_item WHERE id_contacto = $1',
      [id]
    );
    const tieneItemsAsociados = parseInt(contactoItemResult.rows[0].count) > 0;

    // Si el contacto tiene movimientos o ítems asociados, desactivarlo en lugar de eliminarlo
    if (tieneMovimientos || tieneItemsAsociados) {
      await client.query(
        'UPDATE public.contacto SET activo = not activo WHERE id_contacto = $1 RETURNING *',
        [id]
      );
      await client.query('COMMIT');
      return res.status(200).json({
        message: 'El contacto tiene movimientos o ítems asociados. Se ha desactivado.',
        tieneMovimientos,
        tieneItemsAsociados,
      });
    }

    // Si no tiene movimientos ni ítems asociados, eliminarlo
    const deleteResult = await client.query(
      'DELETE FROM public.contacto WHERE id_contacto = $1 RETURNING *',
      [id]
    );

    if (deleteResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    await client.query('COMMIT');
    res.status(200).json({
      message: 'Contacto eliminado correctamente',
      contactoEliminado: deleteResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al eliminar contacto:', error);
    res.status(500).json({ error: `Error al eliminar el contacto: ${error.message}` });
  } finally {
    client.release();
  }
};

const putcontacto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ error: 'ID del contacto no válido' });
        }
    
        const { nombre, tipo_contacto, direccion, telefono, mail, activo } = req.body;
        console.log('Actualizando contacto:', { id, nombre, tipo_contacto, direccion, telefono, mail, activo });
    
        const result = await pool.query(
          'UPDATE public.contacto SET nombre = $1, tipo_contacto = $2, "dirección" = $3, "teléfono" = $4, mail = $5, activo = $6 WHERE id_contacto = $7 RETURNING *',
          [nombre, tipo_contacto, direccion, telefono, mail, activo, id]
        );
    
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Contacto no encontrado' });
        }
    
        const contactoActualizado = {
          id_contacto: result.rows[0].id_contacto,
          nombre: result.rows[0].nombre,
          tipo_contacto: result.rows[0].tipo_contacto,
          direccion: result.rows[0].dirección,
          telefono: result.rows[0].teléfono,
          mail: result.rows[0].mail,
          activo: result.rows[0].activo
        };
    
        res.status(200).json(contactoActualizado);
      } catch (error) {
        console.error('❌ Error al actualizar contacto:', error);
        res.status(500).json({ error: `Error al actualizar el contacto: ${error.message}` });
      }
}

const getcontactoItem = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.contacto_item');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('❌ Error al obtener contactos:', error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
      }
}
module.exports = {
    contacto,
    postcontacto,
    deletecontacto,
    putcontacto,
    getcontactoItem,
    getContactosMovimiento
}