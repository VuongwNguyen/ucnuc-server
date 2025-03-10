const { Op } = require("sequelize");
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

  async getProducts({ page, limit, category_id, keyword }) {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    const offset = page * limit - limit;
    if (category_id === "null") category_id = null;

    const products = await Product.findAndCountAll({
      where: {
        ...(category_id && { category_id }),
        ...(keyword && {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        }),
      },
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

  async updateProduct({
    id,
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
    const product = await Product.findByPk(id, { transaction });
    if (!product) {
      throw new errorResponse({
        message: "Product not found",
        statusCode: 404,
      });
    }

    if (skus && typeof skus === "object" && !Array.isArray(skus)) {
      // Chuyển object thành mảng
      skus = Object.values(skus);
    }

    // Cập nhật thuộc tính của product
    if (category_id) product.category_id = category_id;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (sale_price) product.sale_price = sale_price;
    if (type) product.type = type;
    if (avatar_url) product.avatar_url = avatar_url;
    if (public_id) product.public_id = public_id;

    if (skus.length > 0) {
      const skusRoot = await Sku.findAll({
        where: { product_id: id },
        transaction,
      });
      try {
        const skuIds = skus.map((s) => +s.id);
        const skuRootIds = skusRoot.map((s) => s.id);
        const skuDeleteIds = skuRootIds.filter((id) => !skuIds.includes(id));
        const skuUpdate = skus.filter(
          (s) => s.id !== undefined && s.id !== null
        );
        const skuCreate = skus.filter(
          (s) => s.id === undefined || s.id === null
        );

        // Xóa SKU
        if (skuDeleteIds.length > 0) {
          await Sku.destroy({ where: { id: skuDeleteIds }, transaction });
        }

        // Cập nhật SKU
        if (skuUpdate.length > 0) {
          const updatePromises = skuUpdate.map((skuData) =>
            Sku.update(
              {
                name: skuData.name,
                price: skuData.price,
                sale_price: skuData.sale_price,
                sku: skuData.sku,
              },
              { where: { id: skuData.id }, transaction }
            ).then(([affectedRows]) => {
              if (affectedRows === 0) {
                console.log(`Update SKU ${skuData.id} failed`);
              }
            })
          );
          await Promise.all(updatePromises);
        }

        // Tạo mới SKU
        if (skuCreate.length > 0) {
          await Sku.bulkCreate(
            skuCreate.map((s) => ({ ...s, product_id: product.id })),
            { transaction }
          );
        }
      } catch (e) {
        console.log(e);
        await transaction.rollback();
        throw new errorResponse({
          message: "Error updating sku",
          statusCode: 400,
        });
      }
    }
    await product.save({ transaction }); // Thêm await
    await transaction.commit(); // Commit khi mọi thứ thành công
    return { message: "Update product successfully" };
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
