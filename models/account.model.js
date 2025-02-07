const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");
const bcrypt = require("bcryptjs");

const sequelize = Connection.getInstance();

class Account extends Model {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}
Account.init(
  {
    id: {
      type: DataTypes.CHAR(255),
      primaryKey: true,
      // autoIncrement: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.CHAR(255),
      // unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
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
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    current_refresh_token: {
      type: DataTypes.CHAR(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Account",
    updatedAt: false,
    tableName: "accounts",
    paranoid: true,
  }
);

Account.addHook("beforeCreate", async (account) => {
  account.password = await bcrypt.hash(account.password, 10);
  account.id = Number(String(new Date().getTime()).slice(0, 10));
});
Account.addHook("beforeUpdate", async (account) => {
  if (account.changed("password")) {
    account.password = await bcrypt.hash(account.password, 10);
  }
});
module.exports = Account;
