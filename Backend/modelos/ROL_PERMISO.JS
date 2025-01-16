const { DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS');
// Definición del modelo ROL_PERMISO
const RolPermiso = sequelize.define('RolPermiso', {
    ID_rol_permiso: {
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
    ID_permiso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Permiso',
            key: 'ID_permiso'
        }
    }
}, {
    tableName: 'ROL_PERMISO',
    timestamps: false
});

// Exportar el modelo
module.exports = RolPermiso;