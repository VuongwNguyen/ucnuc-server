const Account = require("./account.model");
const BlackList = require("./blacklist.model");
const Category = require("./category.model");
const Product = require("./product.model");
const Sku = require("./sku.model");

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
/**
 * PRODUCT - CATEGORY
 */
Product.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một product chỉ thuộc về một category

Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một category có thể có nhiều product
/**
 * PRODUCT - SKU
 */
Product.hasMany(Sku, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một product có thể có nhiều sku

Sku.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một sku chỉ thuộc về một product

module.exports = {
  Account,
  BlackList,
  Category,
  Product,
  Sku,
};
