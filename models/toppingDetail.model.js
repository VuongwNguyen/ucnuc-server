const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class ToppingDetail extends Model {
  getSubTotal() {
    return this.quantity * this.price;
  }
}

ToppingDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_topping: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku_topping: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "toppingDetail",
    tableName: "topping_details",
    paranoid: true,
  }
);

module.exports = ToppingDetail;
