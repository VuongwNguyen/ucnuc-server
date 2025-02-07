const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class Area extends Model {}

Area.init(
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
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "area",
    tableName: "areas",
    paranoid: true,
  }
);

Area.beforeCreate(async (area, options) => {
  area.id = Number(String(new Date().getTime()).slice(0, 10));
});

module.exports = Area;
