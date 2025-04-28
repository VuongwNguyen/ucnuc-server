const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class Coupon extends Model {}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount_type: {
      type: DataTypes.ENUM("percen", "fixed"),
      allowNull: false,
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    min_order_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    max_discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    max_uses: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { sequelize, modelName: "coupon", tableName: "coupons" }
);


Coupon.beforeCreate(async (coupon, options) => {
  //validate id is unique
  coupon.id = Number(String(new Date().getTime()).slice(0, 10));
  const coupona = await Coupon.findByPk(coupon.id);

  if (coupona)
    setTimeout(() => {
      coupon.id = Number(String(new Date().getTime()).slice(0, 10));
    }, 1000);
});

module.exports = Coupon;
