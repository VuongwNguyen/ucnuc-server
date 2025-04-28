const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class Point extends Model {}

Point.init(
  {
    id: {
      type: DataTypes.CHAR(255),
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    transaction_type: {
      type: DataTypes.ENUM("purchase", "bonus", "redeem", "refund"),
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.CHAR(255),
      allowNull: false, // nếu là bonus thì ghi tên admin + gift
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "point", tableName: "points" }
);

Point.beforeCreate(async (point, options) => {
  //validate id is unique
  point.id = Number(String(new Date().getTime()).slice(0, 10));
  const pointa = await Point.findByPk(point.id);

  if (pointa)
    setTimeout(() => {
      point.id = Number(String(new Date().getTime()).slice(0, 10));
    }, 1000);
});

module.exports = Point;
