const CategoryService = require("../services/category.service");
const { successfullyResponse } = require("../util/responseHandle");

class CategoryController {
  async createCategory(req, res, next) {
    const { name, description } = req.body;
    const { avatar_url, public_id } = req.body?.image;
    const category = await CategoryService.createCategory({
      name,
      description,
      public_id,
      avatar_url,
    });
    return new successfullyResponse({
      message: "Category created successfully",
      statusCode: 201,
      meta: category,
    }).json(res);
  }

  async getAllCategories(req, res, next) {
    const { page, limit } = req.query;
    const categories = await CategoryService.getAllCategories({
      page,
      limit,
    });
    return new successfullyResponse({
      message: "Collected all categories successfully",
      meta: categories,
    }).json(res);
  }

  async updateCategory(req, res, next) {
    const { id, name, description } = req.body;
    const { avatar_url, public_id } = req.body?.image;

    const category = await CategoryService.updateCategory({
      id,
      name,
      description,
      avatar_url,
      public_id,
    });

    return new successfullyResponse({
      message: category.message,
    }).json(res);
  }

  async deleteCategory(req, res, next) {}
}

module.exports = new CategoryController();
