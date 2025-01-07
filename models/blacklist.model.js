const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class BlackList extends Model {}

BlackList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    refresh_token: {
      type: DataTypes.CHAR(255),
    },
  },
  {
    sequelize,
    tableName: "blacklists",
    modelName: "BlackList",
  }
);

module.exports = BlackList;
