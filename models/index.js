const Account = require("./account.model");
const BlackList = require("./blacklist.model");
const Category = require("./category.model");
const Product = require("./product.model");
const Sku = require("./sku.model");
const Order = require("./order.model");
const OrderDetail = require("./orderDetail.model");
const ToppingDetail = require("./toppingDetail.model");
const Area = require("./area.model");
const Table = require("./table.model");
const Topping = require("./topping.model");

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
/**
 * ORDER - ACCOUNT
 */
Order.belongsTo(Account, {
  foreignKey: "account_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
}); // một order chỉ thuộc về một account

Account.hasMany(Order, {
  foreignKey: "account_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
}); // một account có thể có nhiều order
/**
 * ORDER - ORDERDETAIL
 */
Order.hasMany(OrderDetail, {
  foreignKey: "order_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
}); // một order có thể có nhiều order detail

OrderDetail.belongsTo(Order, {
  foreignKey: "order_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
}); // một order detail chỉ thuộc về một order
/**
 * ORDERDETAIL - TOPPINGDETAIL
 */
OrderDetail.hasMany(ToppingDetail, {
  foreignKey: "order_detail_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
}); // một order detail có thể có nhiều topping detail

ToppingDetail.belongsTo(OrderDetail, {
  foreignKey: "order_detail_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một topping detail chỉ thuộc về một order detail
/**
 * AREA - TABLE
 */
Area.hasMany(Table, {
  foreignKey: "area_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một area có thể có nhiều table

Table.belongsTo(Area, {
  foreignKey: "area_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}); // một table chỉ thuộc về một area

module.exports = {
  Account,
  BlackList,
  Category,
  Product,
  Sku,
  Order,
  OrderDetail,
  ToppingDetail,
  Area,
  Table,
  Topping,
};
