const router = require("express").Router();

router.use("/account", require("./account.routes"));
router.use("/category", require("./category.routes"));
router.use("/product", require("./product.routes"));

module.exports = router;
