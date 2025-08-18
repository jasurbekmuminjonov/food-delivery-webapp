require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/connectDB");
connectDB();
const cors = require("cors");
const path = require("path");
const tokenAuth = require("./middlewares/token.auth");
const basicAuth = require("./middlewares/basic.auth");
const app = express();
app.use(cors()); 
const { createServer } = require("node:http");
const server = createServer(app);
const socket = require("./socket");
const io = require("./middlewares/socket.header")(server);
app.set("socket", io);
socket.connect(io);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1/token", tokenAuth, require("./routes/admin.routes"));
app.use("/api/v1/basic", basicAuth, require("./routes/user.routes"));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}/api/v1`);
});