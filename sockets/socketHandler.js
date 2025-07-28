// sockets/socketHandler.js

const startGameEngine = require("./gameEngine");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    socket.emit("connected", { msg: "Welcome to Crash Game!" });

    // You can add event listeners from client here like:
    // socket.on("placeBet", data => {})
  });

  // Start the game loop
  startGameEngine(io);
};
