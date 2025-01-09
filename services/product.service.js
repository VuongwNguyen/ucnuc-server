const connection = require("../bin/connection");
const { Product, Sku } = require("../models");
const { errorResponse } = require("../util/responseHandle");

const sequelize = connection.getInstance();

class ProductService {
  async createProduct({
    category_id,
    name,
    description,
    price,
    sale_price,
    type,
    avatar_url,
    public_id,
    skus = [],
  }) {
    const transaction = await sequelize.transaction();
    if (!name || !price || !type || !category_id) {
      throw new errorResponse({
        message: "Name, price, type and category are required",
        statusCode: 400,
      });
    }

    const product = await Product.create(
      {
        category_id,
        name,
        description,
        price,
        sale_price,
        type,
        avatar_url,
        public_id,
      },
      {
        transaction,
      }
    );

    if (skus.length > 0) {
      const res = await Sku.bulkCreate(
        skus.map((s) => ({ ...s, product_id: product.id })),
        { transaction }
      );
      if (!res) {
        await transaction.rollback();
        throw new errorResponse({
          message: "Error creating sku",
          statusCode: 500,
        });
      }
    }

    if (!product) {
      await transaction.rollback();
      throw new errorResponse({
        message: "Error creating product",
        statusCode: 500,
      });
    }

    await transaction.commit();
    return product;
  }

  async getProducts({ page, limit }) {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    const offset = page * limit - limit;

    const products = await Product.findAndCountAll({
      limit,
      offset,
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "sale_price",
        "type",
        "avatar_url",
        "public_id",
      ],
      include: [
        {
          association: "category",
          attributes: ["name", "id"],
        },
        {
          model: Sku,
          as: "skus",
          attributes: ["id", "name", "price", "sale_price", "sku"],
        },
      ],
    });

    const maxPage = Math.max(Math.ceil(products.count / limit), 1);

    return {
      list: products.rows,
      page: {
        maxPage,
        currentPage: page,
        limit,
        hasNext: page < maxPage,
        hasPrevious: page > 1,
      },
    };
  }

  async getProductById(id) {
    return Product.findByPk(id);
  }

  async updateProduct(id, product) {
    return Product.update(product, {
      where: {
        id,
      },
    });
  }

  async deleteProduct(id) {
    return Product.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = new ProductService();
