const router = require("express").Router();
const asyncHandler = require("../util/asyncHandler");

const PaymentController = require("../controllers/payment.controller");

router.post("/create", asyncHandler(PaymentController.createPayment));
router.post("/paymentWebhook", asyncHandler(PaymentController.paymentWebhook));

module.exports = router;
