const router = require("express").Router();
const uploadImage = require("../middlewares/upload.middleware");
const asyncHandler = require("../util/asyncHandler");
const uploader = require("../util/uploader");
const CategoryController = require("../controllers/category.controller");
const { protected, adminVerify } = require("../middlewares/protected");

// router.use(protected);
router.get("/category", asyncHandler(CategoryController.getAllCategories));

/**
 * @adminzone - only admin can create category
 */
// router.use(adminVerify);
router.post(
  "/category",
  uploader.single("image"),
  asyncHandler(uploadImage.uploadImage),
  asyncHandler(CategoryController.createCategory),
  uploadImage.deleteImage
);

router.put(
  "/category",
  uploader.single("image"),
  asyncHandler(uploadImage.uploadImage),
  asyncHandler(CategoryController.updateCategory),
  uploadImage.deleteImage
);

module.exports = router;
