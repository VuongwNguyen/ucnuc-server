const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "category",
    tableName: "categories",
    paranoid: true,
  }
);

Category.beforeCreate(async (category, options) => {
  category.id = Number(String(new Date().getTime()).slice(0, 10));
});

module.exports = Category;
