const { successfullyResponse } = require("../util/responseHandle");
const { getIO } = require("../socket");

const OrderService = require("../services/order.service");

class OrderController {
  async createOrder(req, res) {
    const {
      user_id,
      table_name,
      payment_method,
      payment_status,
      ref_pay,
      order_type,
      total,
      status,
      order_details,
    } = req.body;

    const order = await OrderService.createOrder(user_id, {
      table_name,
      payment_method,
      payment_status,
      ref_pay,
      order_type,
      total,
      status,
      order_details,
    });

    if (order) {
      OrderService.getOrders({ page: 1, limit: 10000 }).then((orders) => {
        getIO().emit("initOrder", orders);
      });
    }

    return new successfullyResponse({
      message: "Order created successfully",
      statusCode: 201,
      meta: order,
    }).json(res);
  }

  async getOrdersByID(req, res) {
    const { order_id } = req.body;
    const orders = await OrderService.getOrdersByID({ order_id });

    return new successfullyResponse({
      message: "Orders found",
      statusCode: 200,
      meta: orders,
    }).json(res);
  }

  async updateOrderStatus(req, res) {
    const { order_id, status } = req.body;
    const orders = await OrderService.updateOrderStatus({ order_id, status });

    if (orders) {
      OrderService.getOrders({ page: 1, limit: 10000 }).then((orders) => {
        console.log("init");
        getIO().emit("initOrder", orders);
        console.log("end");
      });
    }

    return new successfullyResponse({
      message: "Order updated",
      statusCode: 200,
      meta: orders,
    }).json(res);
  }

  async updatePaymentStatus(req, res) {
    const { order_id, payment_status, ref_pay } = req.body;
    const orders = await OrderService.updatePaymentStatus({
      order_id,
      payment_status,
      ref_pay,
    });

    if (orders) {
      OrderService.getOrders({ page: 1, limit: 10000 }).then((orders) => {
        getIO().emit("initOrder", orders);
      });
    }

    return new successfullyResponse({
      message: "Payment status updated",
      statusCode: 200,
      meta: orders,
    }).json(res);
  }
}

module.exports = new OrderController();
