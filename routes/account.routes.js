const asyncHandler = require("../util/asyncHandler");
const AccountController = require("../controllers/account.controller");
const router = require("express").Router();

router.post(
  "/create",
  asyncHandler(AccountController.create),
  asyncHandler(AccountController.sendEmail)
);

router.post("/verify-email", asyncHandler(AccountController.verifyEmail));


module.exports = router;
