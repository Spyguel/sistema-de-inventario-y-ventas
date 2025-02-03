const { DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS');

// Definición del modelo USUARIO
const Usuario = sequelize.define('Usuario', {
    ID_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rol',
            key: 'ID_rol'
        }
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'USUARIO',
    timestamps: false
});

// Exportar el modelo
module.exports = Usuario;