const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS'); 
class ContactoItem extends Model {}

ContactoItem.init({
    ID_contacto_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_item: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_contacto: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ContactoItem',
    tableName: 'CONTACTO_ITEM',
    timestamps: false
});

module.exports = ContactoItem;