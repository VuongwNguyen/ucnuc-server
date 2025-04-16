const { Topping } = require("../models");
const { errorResponse } = require("../util/responseHandle");
const { Op } = require("sequelize");

class ToppingService {
  async createTopping({ name, price, sku, type }) {
    const existingTopping = await Topping.findOne({
      where: {
        [Op.or]: [{ name }, { sku }],
      },
    });

    if (existingTopping)
      throw new errorResponse({
        message: "Topping already exists",
        status: 400,
      });

    const newTopping = await Topping.create({ name, price, sku, type });

    if (!newTopping)
      throw new errorResponse({
        message: "Topping not created",
        status: 401,
      });

    return newTopping;
  }

  async getToppings({ type }) {
    if(!type) type = null;

    const toppings = await Topping.findAll({
      where: {
        ...(type && { type }),
      },
    });

    return toppings;
  }
}

module.exports = new ToppingService();
