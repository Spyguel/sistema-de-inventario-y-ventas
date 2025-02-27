const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.js');
class Movimiento extends Model {}

Movimiento.init({
    ID_movimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_movimiento_item: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_contacto: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ID_movimiento_documento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha_mov: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo_mov: {
        type: DataTypes.ENUM(
            'COMPRA',
            'VENTA',
            'AJUSTE INVENTARIO',
            'PRODUCCION',
            'CONSUMO INTERNO',
            'TRASFERENCIA',
            'DEVOLUCION'
        ),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tipo_movimiento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    razón: {
        type: DataTypes.STRING,
        allowNull: true
    },
    detalle: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Movimiento',
    tableName: 'movimiento',
    timestamps: false // Cambia a true si deseas que Sequelize maneje createdAt y updatedAt
});