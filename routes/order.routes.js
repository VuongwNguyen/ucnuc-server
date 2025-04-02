const OrderController = require("../controllers/order.controller");
const asyncHandler = require("../util/asyncHandler");
const { protected, adminVerify } = require("../middlewares/protected");

const router = require("express").Router();

router.post("/create", asyncHandler(OrderController.createOrder));
router.post("/getOrdersByID", asyncHandler(OrderController.getOrdersByID));
router.use(protected);
router.use(adminVerify);
router.put(
  "/updateOrderStatus",
  asyncHandler(OrderController.updateOrderStatus)
);
router.put(
  "/updatePaymentStatus",
  asyncHandler(OrderController.updatePaymentStatus)
);

module.exports = router;
