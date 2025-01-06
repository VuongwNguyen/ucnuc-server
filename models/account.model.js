const { Model, DataTypes } = require("sequelize");
const Connection = require("../bin/connection");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

const sequelize = Connection.getInstance();

class Account extends Model {}
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
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
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
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
  account.password = await bcrypt.hash(account.password, 10);
  const id = nanoid(10); // Tạo ID ngắn độc nhất
  const numericId = BigInt(`0x${Buffer.from(id).toString("hex")}`).toString();
  console.log(numericId);
  account.id = numericId;
});
Account.addHook("beforeUpdate", async (account) => {
  if (account.changed("password")) {
    account.password = await bcrypt.hash(account.password, 10);
  }
});
module.exports = Account;
