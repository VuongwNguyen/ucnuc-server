const router = require("express").Router();

router.use("/account", require("./account.routes"));

module.exports = router;
