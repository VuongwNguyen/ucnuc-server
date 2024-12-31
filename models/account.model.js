const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");

const sequelize = Connection.getInstance();

class Account extends Model {}
Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, //
      unique: true,
      validate: {
        is: /^\+?[0-9]{10}$/i,
      },
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
  },
  {
    sequelize,
    modelName: "Account",
    updatedAt: false,
    tableName: "accounts",
  }
);

Account.addHook("beforeCreate", async (account) => {
  const bcrypt = require("bcryptjs");
  account.password = await bcrypt.hash(account.password, 10);
});
Account.addHook("beforeUpdate", async (account) => {
  if (account.changed("password")) {
    const bcrypt = require("bcryptjs");
    account.password = await bcrypt.hash(account.password, 10);
  }
});
module.exports = Account;
