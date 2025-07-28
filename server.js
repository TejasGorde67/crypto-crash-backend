const priceRoute = require("./routes/price");

require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const betRoutes = require("./routes/betRoutes");
const cashoutRoutes = require("./routes/cashoutRoutes");

app.use("/api", betRoutes);
app.use("/api", cashoutRoutes);
app.use("/api/price", priceRoute); // ✅ add this line

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use(express.static("public")); // right above app.get("/")
app.get("/", (req, res) => res.send("🚀 Crypto Crash Backend Running"));

// Socket setup
require("./sockets/socketHandler")(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🌐 Server listening on port ${PORT}`));
