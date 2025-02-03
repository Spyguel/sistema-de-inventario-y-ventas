const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS'); 
class MovimientoDocumento extends Model {}

MovimientoDocumento.init({
    ID_movimiento_documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_documento: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'MovimientoDocumento',
    tableName: 'MOVIMIENTO_DOCUMENTO',
    timestamps: false
});

module.exports = MovimientoDocumento;