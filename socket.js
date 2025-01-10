const { Server } = require("socket.io");

let io;

const socketinitialize = (server) => {
  io = new Server(server);

  io.use(function (socket, next) {
    const token = socket.handshake.auth.token;
    if (isValid(token)) return next();
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Lắng nghe sự kiện tùy chỉnh
    socket.on("chat message", (msg) => {
      console.log("Message received: " + msg);
      io.emit("chat message", msg); // Gửi lại tin nhắn tới tất cả client
    });

    // Lắng nghe sự kiện disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected");
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
