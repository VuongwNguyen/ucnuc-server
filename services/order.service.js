const { Order, OrderDetail, ToppingDetail, Account } = require("../models");
const Connection = require("../bin/connection");
const { errorResponse } = require("../util/responseHandle");
const { Op } = require("sequelize");

const sequelize = Connection.getInstance();

class OrderService {
  async createOrder(
    account_id,
    {
      table_name,
      payment_method = "cash",
      ref_pay = null,
      order_type = "dine-in",
      total = 0,
      status = "pending",
      order_details = [],
    }
  ) {
    const transaction = await sequelize.transaction();
    let account = null;
    if (account_id) {
      account = await Account.findByPk(account_id);
    }
    account = await Account.findOne({ where: { role: "admin" } });
    
    if (!account)
      throw new errorResponse({
        message: "Account not found",
        status: 404,
      });

    const newOrder = await Order.create(
      {
        account_id,
        table_name,
        payment_method,
        order_type,
        ref_pay,
        total,
        status,
      },
      { transaction }
    );

    if (!newOrder)
      throw new errorResponse({
        message: "Order not created",
        status: 401,
      });

    for (let i = 0; i < order_details.length; i++) {
      const orderDetail = order_details[i];
      const { product_name, quantity, price, toppings } = orderDetail;

      const newOrderDetail = await OrderDetail.create(
        {
          order_id: newOrder.id,
          product_name,
          quantity,
          price,
        },
        { transaction }
      );

      if (!newOrderDetail)
        throw new errorResponse({
          message: "Order detail not created",
          status: 401,
        });

      for (let j = 0; j < toppings.length; j++) {
        const toppingDetail = toppings[j];
        const { name_topping, sku_topping, price, quantity } = toppingDetail;
        await ToppingDetail.create(
          {
            order_detail_id: newOrderDetail.id,
            name_topping,
            sku_topping,
            price,
            quantity,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    const newOrderQuery = await Order.findByPk(newOrder.id, {
      attributes: [
        "id",
        "table_name",
        "payment_method",
        "payment_status",
        "ref_pay",
        "order_type",
        "total",
        "status",
        "createdAt",
      ],
      include: [
        {
          association: "orderDetails",
          include: [
            {
              association: "toppingDetails",
              attributes: ["name_topping", "sku_topping", "price", "quantity"],
            },
          ],
          attributes: ["product_name", "quantity", "price"],
        },
      ],
    });

    return newOrderQuery;
  }

  async getOrders({ page, limit }) {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    const offset = page * limit - limit;

    const orders = await Order.findAndCountAll({
      limit,
      offset,
      where: {
        status: {
          [Op.or]: ["pending", "processing"],
        },
      },
      order: [["createdAt", "ASC"]],
      attributes: [
        "id",
        "table_name",
        "payment_method",
        "payment_status",
        "ref_pay",
        "order_type",
        "total",
        "status",
        "createdAt",
      ],
      include: [
        {
          association: "orderDetails",
          include: [
            {
              association: "toppingDetails",
              attributes: ["name_topping", "sku_topping", "price", "quantity"],
            },
          ],
          attributes: ["product_name", "quantity", "price"],
        },
      ],
    });

    const maxPage = Math.max(Math.ceil(orders.count / limit), 1);

    return {
      list: orders.rows,
      page: {
        maxPage,
        currentPage: page,
        limit,
        hasNext: page < maxPage,
        hasPrevious: page > 1,
      },
    };
  }

  async getOrdersByID({ order_id }) {
    const order = await Order.findByPk(order_id, {
      attributes: [
        "id",
        "table_name",
        "payment_method",
        "payment_status",
        "ref_pay",
        "order_type",
        "total",
        "status",
        "createdAt",
      ],
      include: [
        {
          association: "orderDetails",
          include: [
            {
              association: "toppingDetails",
              attributes: ["name_topping", "sku_topping", "price", "quantity"],
            },
          ],
          attributes: ["product_name", "quantity", "price"],
        },
      ],
    });

    if (!order)
      throw new errorResponse({
        message: "Order not found",
        statusCode: 404,
      });

    return order;
  }

  async updateOrderStatus({ order_id, status }) {
    const order = await Order.findByPk(order_id);
    if (!order)
      throw new errorResponse({
        message: "Order not found",
        statusCode: 404,
      });

    order.status = status;
    await order.save();

    return order;
  }

  async updatePaymentStatus({ order_id, payment_status, ref_pay }) {
    const order = await Order.findByPk(order_id);
    if (!order)
      throw new errorResponse({
        message: "Order not found",
        statusCode: 404,
      });

    order.payment_status = payment_status;
    // order.ref_pay = ref_pay;
    await order.save();

    return order;
  }

  async getOrdersByAccountID({ account_id }) {
    const orders = await Order.findAll({
      where: {
        account_id,
      },
      attributes: [
        "id",
        "table_name",
        "payment_method",
        "payment_status",
        "ref_pay",
        "order_type",
        "total",
        "status",
        "createdAt",
      ],
      include: [
        {
          association: "orderDetails",
          include: [
            {
              association: "toppingDetails",
              attributes: ["name_topping", "sku_topping", "price", "quantity"],
            },
          ],
          attributes: ["product_name", "quantity", "price"],
        },
      ],
    });

    return orders;
  }
}

module.exports = new OrderService();
