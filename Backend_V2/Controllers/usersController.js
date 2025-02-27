const pool = require('../db');

// LISTAR USUARIOS
const usuarios = async (req, res) => {
    try {
        const result = await pool.query(
          `SELECT u."ID_usuario", u.email, r.nombre AS rol, u.activo AS estado
           FROM public."USUARIO" u
           JOIN public."ROL" r ON u."ID_rol" = r."ID_rol"`
        );
        res.status(200).json({ usuarios: result.rows });
        console.log("USUARIOS OBTENIDOS :", result.rows)
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
}


//EDITAR USUARIOS

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
    
        // Consulta SQL para actualizar el usuario
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
    
        // Devolver el usuario actualizado
        const updatedUser = result.rows[0];
        res.status(200).json({ 
          message: 'Usuario actualizado correctamente', 
          user: updatedUser 
        });
      } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
}

module.exports = {
    usuarios,
    putUsuarios
};
