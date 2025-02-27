const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS'); 
class Item extends Model {}

Item.init({
    ID_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    unidad_medida: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_item: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad_actual: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    cantidad_minima: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Item',
    tableName: 'ITEM',
    timestamps: false
});

module.exports = Item;