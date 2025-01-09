const { Category } = require("../models");
const { errorResponse } = require("../util/responseHandle");

class CategoryService {
  async createCategory({ name, description, avatar_url, public_id }) {
    if (!name)
      throw new errorResponse({
        message: "Name is required",
        statusCode: 400,
      });
    const categoryValid = await Category.findOne({ where: { name } });

    if (categoryValid)
      throw new errorResponse({
        message: "Category already exists",
        statusCode: 400,
      });

    const category = await Category.create({
      name,
      description,
      avatar_url,
      public_id,
    });
    if (!category)
      throw new errorResponse({
        message: "Error creating category",
        statusCode: 500,
      });

    return category;
  }

  async getAllCategories({ page, limit }) {
    // valid and set default values for page and limit
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    const offset = page * limit - limit;

    const category = await Category.findAndCountAll({
      // where: {  },
      limit,
      offset,
      attributes: ["id", "name", "description", "avatar_url", "public_id"],
    });

    if (!category)
      throw new errorResponse({
        message: "Error fetching categories",
        statusCode: 400,
      });

    const maxPage = Math.max(Math.ceil(category.count / limit), 1);

    return {
      list: category.rows,
      page: {
        maxPage,
        currentPage: page,
        limit,
        hasNext: page < maxPage,
        hasPrevious: page > 1,
      },
    };
  }

  async updateCategory(id, { name, description, avatar_url, public_id }) {
    return Category.update(
      {
        name,
        description,
        avatar_url,
        public_id,
      },
      { where: { id } }
    );
  }

  async deleteCategory(id) {
    return Category.destroy({ where: { id } });
  }
}

module.exports = new CategoryService();
