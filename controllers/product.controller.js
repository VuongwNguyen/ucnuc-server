const ProductService = require("../services/product.service");
const ToppingService = require("../services/topping.service");
const { successfullyResponse } = require("../util/responseHandle");

class ProductController {
  async createProduct(req, res) {
    console.log(req.body);
    const { category_id, name, description, price, sale_price, type, skus } =
      req.body;
    const { avatar_url, public_id } = req.body?.image;

    const product = await ProductService.createProduct({
      category_id,
      name,
      description,
      price,
      sale_price,
      type,
      avatar_url,
      public_id,
      skus,
    });
    return new successfullyResponse({
      message: "Product created successfully",
      meta: product,
      statusCode: 201,
    }).json(res);
  }

  async getProducts(req, res) {
    const { page, limit, category_id, keyword } = req.query;
    const products = await ProductService.getProducts({
      page,
      limit,
      category_id,
      keyword,
    });
    return new successfullyResponse({
      message: "Products fetched successfully",
      meta: products,
    }).json(res);
  }

  async updateProduct(req, res) {
    //
    const {
      id,
      category_id,
      name,
      description,
      price,
      sale_price,
      type,
      skus,
    } = req.body;
    const { avatar_url, public_id } = req.body?.image;

    const product = await ProductService.updateProduct({
      id,
      category_id,
      name,
      description,
      price,
      sale_price,
      type,
      avatar_url,
      public_id,
      skus,
    });

    return new successfullyResponse({
      message: product.message,
      statusCode: 200,
    }).json(res);
  }

  async createTopping(req, res) {
    const { name, price, sku, type } = req.body;
    const topping = await ToppingService.createTopping({
      name,
      price,
      sku,
      type,
    });
    return new successfullyResponse({
      message: "Topping created successfully",
      meta: topping,
      statusCode: 201,
    }).json(res);
  }

  async getToppings(req, res) {
    const { type } = req.query;
    const toppings = await ToppingService.getToppings({ type });
    return new successfullyResponse({
      message: "Toppings fetched successfully",
      meta: toppings,
    }).json(res);
  }
}

module.exports = new ProductController();
