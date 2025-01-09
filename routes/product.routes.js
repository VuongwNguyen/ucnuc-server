const router = require("express").Router();
const uploadImage = require("../middlewares/upload.middleware");
const asyncHandler = require("../util/asyncHandler");
const uploader = require("../util/uploader");
const ProductController = require("../controllers/product.controller");
const { protected, adminVerify } = require("../middlewares/protected");

router.use(protected);
router.get("/product", asyncHandler(ProductController.getProducts));
/**
 * @adminzone - only admin can create product
 */
router.use(adminVerify);
router.post(
  "/product",
  uploader.single("image"),
  asyncHandler(uploadImage.uploadImage),
  asyncHandler(ProductController.createProduct),
  uploadImage.deleteImage
);

module.exports = router;
