const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS');
class ComposicionItem extends Model {}

ComposicionItem.init({
    ID_composicion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_item: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_usada: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ComposicionItem',
    tableName: 'COMPOSICION_ITEM',
    timestamps: false
});

module.exports = ComposicionItem;