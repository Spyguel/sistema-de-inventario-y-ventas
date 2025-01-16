const { DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS');
// Definición del modelo PERMISO
const Permiso = sequelize.define('Permiso', {
    ID_permiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'PERMISO',
    timestamps: false
});

// Exportar el modelo
module.exports = Permiso;