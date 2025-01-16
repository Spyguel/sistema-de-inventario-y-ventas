const { DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS');
// Definición del modelo ROL
const Rol = sequelize.define('Rol', {
    ID_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_rol_permiso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descripción: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'ROL',
    timestamps: false
});

// Exportar el modelo
module.exports = Rol;