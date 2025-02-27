const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS'); 
class Lote extends Model {}

Lote.init({
    ID_lote: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_item: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_lote: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_creacion_llegada: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_vencimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Lote',
    tableName: 'LOTE',
    timestamps: false
});

module.exports = Lote;