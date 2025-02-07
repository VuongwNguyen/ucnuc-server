const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("cash", "card"),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    ref_pay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order_type: {
      type: DataTypes.ENUM("delivery", "takeaway", "dine-in"),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "order",
    tableName: "orders",
    paranoid: true,
  }
);

Order.beforeCreate(async (order, options) => {
  //validate id is unique
  order.id = Number(String(new Date().getTime()).slice(0, 10));
  const ordera = await Order.findByPk(order.id);

  if (ordera)
    setTimeout(() => {
      order.id = Number(String(new Date().getTime()).slice(0, 10));
    }, 1000);

  if (order.order_type === "delivery") {
    order.table_name = "Delivery";
  }
  if (order.order_type === "takeaway") {
    order.table_name = "Takeaway";
  }
});

module.exports = Order;
