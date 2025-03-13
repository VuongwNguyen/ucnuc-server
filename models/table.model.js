const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class Table extends Model {}

Table.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("free", "busy"),
      allowNull: false,
      defaultValue: "free",
    },
  },
  {
    sequelize,
    modelName: "table",
    tableName: "tables",
    paranoid: true,
  }
);

Table.beforeCreate(async (table, options) => {
  table.id = Number(String(new Date().getTime()).slice(0, 10));
});

module.exports = Table;
