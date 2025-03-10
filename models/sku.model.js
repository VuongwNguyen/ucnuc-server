const {Model, DataTypes} = require('sequelize');
const Connection = require('../bin/connection');

const sequelize = Connection.getInstance();

class Sku extends Model {}

Sku.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'sku',
    tableName: 'skus',
  }
);

module.exports = Sku;