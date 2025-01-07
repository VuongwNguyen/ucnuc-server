const Account = require("./account.model");
const BlackList = require("./blacklist.model");

/**
 * ACCOUNT - BLACKLIST
 */
Account.hasMany(BlackList, {
  foreignKey: "account_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // môt account có thể có nhiều token
BlackList.belongsTo(Account, {
  foreignKey: "account_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một token chỉ thuộc về một account


module.exports = {
  Account,
  BlackList,
};
