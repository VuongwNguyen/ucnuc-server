const PaymentService = require("../services/payment.service");
const { successfullyResponse } = require("../util/responseHandle");
const { getIO } = require("../socket");
const orderService = require("../services/order.service");

class PaymentController {
  async createPayment(req, res) {
    const { amount, orderCode, items, origin } = req.body;

    const payment = await PaymentService.createPayment({
      amount,
      orderCode,
      items,
      origin,
    });

    return new successfullyResponse({
      message: "Payment created successfully",
      statusCode: 201,
      meta: payment,
    }).json(res);
  }

  async paymentWebhook(req, res) {
    const { code, desc, success, data, signature } = req.body;

    await PaymentService.paymentWebhook({
      code,
      desc,
      success,
      data,
      signature,
    });

    const order = await orderService.getOrders({page: 1, limit: 1000});
    getIO().emit("initOrder", order);

    return new successfullyResponse({
      message: "Webhook payment received",
      statusCode: 200,
    }).json(res);
  }
}

module.exports = new PaymentController();
