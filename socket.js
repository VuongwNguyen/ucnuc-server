const { Server } = require("socket.io");
const OrderService = require("./services/order.service");

let io;
let quantity = 0;
const socketinitialize = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // io.use(function (socket, next) {
  //   const token = socket.handshake.auth.token;
  //   if (isValid(token)) return next();
  // });

  io.on("connection", (socket) => {
    console.log(`A user connected ${socket.id}`);
    quantity++;

    console.log("quantity", quantity);
    //  initOrder
    socket.on("initOrder", async (data) => {
      console.log("initOrder");
      const orders = await OrderService.getOrders(data);
      socket.emit("initOrder", orders);
    });

    socket.on("disconnect", () => {
      console.log(`A user disconnected ${socket.id}`);
      quantity--;
      console.log("quantity", quantity);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { socketinitialize, getIO };
