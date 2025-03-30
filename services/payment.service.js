const payOS = require("../bin/payos");
const { errorResponse } = require("../util/responseHandle");
const { Order } = require("../models");

class PaymentService {
  async createPayment({ orderCode, amount, items, origin }) {
    if (!orderCode || !amount || !items || !origin)
      throw new errorResponse({
        message: "Order code, amount, items, and origin are required",
        statusCode: 400,
      });

    const order = await Order.findOne({ where: { id: orderCode } });

    if (!order)
      throw new errorResponse({
        message: "Order not found",
        statusCode: 404,
      });

    const payment = await payOS.createPaymentLink({
      orderCode: parseInt(orderCode),
      amount,
      items,
      description: `ucnuc-${orderCode}`,
      cancelUrl: `${origin}/checkout/${orderCode}`,
      returnUrl: `${origin}/checkout/${orderCode}`,
    });
    console.log("Payment", payment);

    if (!payment)
      throw new errorResponse({
        message: "Error creating payment",
        statusCode: 401,
      });

    // payOS
    //   .createPaymentLink({
    //     orderCode: parseInt(orderCode),
    //     amount,
    //     items,
    //     description: `ucnuc-${orderCode}`,
    //     cancelUrl: `${origin}/checkout/${orderCode}`,
    //     returnUrl: `${origin}/checkout/${orderCode}`,
    //   })
    //   .then((res) => {
    //     return res;
    //   })
    //   .catch((err) => {
    //     throw new errorResponse({ message: err.message, statusCode: 401 });
    //   });

    try {
      payOS.createPaymentLink({
        orderCode: parseInt(orderCode),
        amount,
        items,
        description: `ucnuc-${orderCode}`,
        cancelUrl: `${origin}/checkout/${orderCode}`,
        returnUrl: `${origin}/checkout/${orderCode}`,
      });
    } catch (err) {
      throw new errorResponse({ message: err.message, statusCode: 401 });
    }
  }

  async paymentWebhook({
    code = "",
    desc = "",
    success = false,
    data = {},
    signature = "",
  }) {
    console.log("Webhook payment", code, desc, success, data, signature);
    if (data.orderCode === 123) return;
    const order = await Order.findOne({ where: { id: data.orderCode } });
    if (!order)
      throw new errorResponse({ message: "Order not found", statusCode: 401 });
    order.payment_method = "card";
    order.payment_status = "completed";
    order.ref_pay = data.reference;

    await order.save();
  }
}

module.exports = new PaymentService();
