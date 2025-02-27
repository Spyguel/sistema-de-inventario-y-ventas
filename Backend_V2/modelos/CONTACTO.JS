const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS');
class Contacto extends Model {}

Contacto.init({
    ID_contacto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_contacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Dirección: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    Teléfono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Mail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Contacto',
    tableName: 'CONTACTO',
    timestamps: false
});

module.exports = Contacto;