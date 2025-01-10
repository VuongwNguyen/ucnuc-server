const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class OrderDetail extends Model {
  getSubTotal() {
    return this.quantity * this.price;
  }
}

OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "orderDetail",
    tableName: "order_details",
    paranoid: true,
  }
);
OrderDetail.addHook("beforeCreate", (orderDetail, options) => {
  orderDetail.id = Number(String(new Date().getTime()).slice(0, 10));
});

module.exports = OrderDetail;
