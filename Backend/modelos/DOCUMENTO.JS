const { Model, DataTypes } = require('sequelize');
const sequelize = require('./DATABASE.JS');
class Documento extends Model {}

Documento.init({
    ID_documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_contacto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo_documento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_documento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    PDF: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sub_total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Estado: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Documento',
    tableName: 'DOCUMENTO',
    timestamps: false
});

module.exports = Documento;