const pool = require('../db');
const bcrypt = require('bcrypt');

// LISTAR USUARIOS (GET /usuarios)
const usuarios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u."ID_usuario", u.email, r.nombre AS rol, u.activo AS estado
       FROM public."USUARIO" u
       JOIN public."ROL" r ON u."ID_rol" = r."ID_rol"`
    );
    res.status(200).json({ usuarios: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// INSERTAR USUARIO (POST /register)
const postUsuario = async (req, res) => {
  try {
    // Imprimir el cuerpo de la solicitud para verificar qué datos llegan
    console.log('Datos recibidos en POST /usuarios:', req.body);

    const { email, password, roleId } = req.body;

    // Validación básica de datos
    if (!email || !password || !roleId) {
      console.log('Faltan datos en el cuerpo de la solicitud');
      return res.status(400).json({ error: 'Faltan datos para registrar el usuario' });
    }

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await pool.query(
      'SELECT * FROM public."USUARIO" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('El correo electrónico ya está registrado:', email);
      return res.status(400).json({ error: 'Un usuario con ese correo electrónico ya está registrado' });
    }

    // Verificar que los datos estén correctos
    console.log('Datos validados:', { email, password, roleId });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Realizar la inserción en la base de datos
    const result = await pool.query(
      'INSERT INTO public."USUARIO" ("ID_rol", email, "contraseña", activo) VALUES ($1, $2, $3, $4) RETURNING *',
      [roleId, email, hashedPassword, true]
    );

    // Imprimir el resultado de la inserción
    console.log('Usuario registrado correctamente:', result.rows[0]);

    // Responder con el usuario registrado
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



// EDITAR USUARIOS (PUT /usuarios/:id)
const putUsuarios = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    const { email, password, roleId } = req.body;

    // Hashear la nueva contraseña si se proporciona
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const query = `
      UPDATE public."USUARIO"
      SET 
          email = COALESCE($1, email),
          "contraseña" = COALESCE($2, "contraseña"),
          "ID_rol" = COALESCE($3, "ID_rol")
      WHERE "ID_usuario" = $4
      RETURNING *;
    `;

    const result = await pool.query(query, [email, hashedPassword, roleId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updatedUser = result.rows[0];
    res.status(200).json({ 
      message: 'Usuario actualizado correctamente', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ELIMINAR / INACTIVAR USUARIO (DELETE /usuarios/:id)
const toggleUserStatusOrDelete = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    // Verificar si el usuario tiene movimientos asociados
    const movementResult = await pool.query(
      'SELECT COUNT(*) AS count FROM public."movimiento" WHERE id_usuario = $1',
      [userId]
    );
    const count = parseInt(movementResult.rows[0].count, 10);

    if (count > 0) {
      // Si el usuario tiene movimientos, cambiar su estado activo/inactivo
      const userResult = await pool.query(
        'UPDATE public."USUARIO" SET activo = NOT activo WHERE "ID_usuario" = $1 RETURNING *',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const updatedUser = userResult.rows[0];
      const message = updatedUser.activo
        ? 'Usuario activado correctamente'
        : 'Usuario inactivado correctamente';

      return res.status(200).json({ message, user: updatedUser });
    } else {
      // Si el usuario no tiene movimientos, eliminarlo definitivamente
      const deleteResult = await pool.query(
        'DELETE FROM public."USUARIO" WHERE "ID_usuario" = $1 RETURNING *',
        [userId]
      );

      if (deleteResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.status(200).json({
        message: 'Usuario eliminado correctamente',
        user: deleteResult.rows[0]
      });
    }
  } catch (error) {
    console.error('Error al cambiar el estado o eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Exportar las funciones
module.exports = {
  usuarios,
  postUsuario,
  putUsuarios,
  toggleUserStatusOrDelete
};
