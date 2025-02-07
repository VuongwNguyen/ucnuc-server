const router = require("express").Router();

router.use("/account", require("./account.routes"));
router.use("/category", require("./category.routes"));
router.use("/product", require("./product.routes"));
router.use("/table", require("./tableArea.routes"));
router.use("/order", require("./order.routes"));

module.exports = router;
