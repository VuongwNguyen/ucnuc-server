const ProductService = require("../services/product.service");
const { successfullyResponse } = require("../util/responseHandle");

class ProductController {
  async createProduct(req, res) {
    const {
      category_id,
      name,
      description,
      price,
      sale_price,
      type,
      skus
    } = req.body;
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
      skus
    });
    return new successfullyResponse({
      message: "Product created successfully",
      meta: product,
      statusCode: 201,
    }).json(res);
  }

  async getProducts(req, res) {
    const { page, limit } = req.query;
    const products = await ProductService.getProducts({ page, limit });
    return new successfullyResponse({
      message: "Products fetched successfully",
      meta: products,
    }).json(res);
  }
}

module.exports = new ProductController();
