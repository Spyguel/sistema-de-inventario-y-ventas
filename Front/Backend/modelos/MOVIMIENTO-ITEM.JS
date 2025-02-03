const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.js'); 
class MovimientoItem extends Model {}

MovimientoItem.init({
    ID_movimiento_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_item: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'MovimientoItem',
    tableName: 'MOVIMIENTO_ITEM',
    timestamps: false
});

module.exports = MovimientoItem;