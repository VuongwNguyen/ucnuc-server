const OrderController = require("../controllers/order.controller");
const asyncHandler = require("../util/asyncHandler");

const router = require("express").Router();

router.post("/create", asyncHandler(OrderController.createOrder));
router.post("/getOrdersByID", asyncHandler(OrderController.getOrdersByID));
router.put("/updateOrderStatus", asyncHandler(OrderController.updateOrderStatus));
router.put("/updatePaymentStatus", asyncHandler(OrderController.updatePaymentStatus));

module.exports = router;
