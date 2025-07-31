require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/connectDB");
connectDB();
const cors = require("cors");
const path = require("path");
const tokenAuth = require("./middlewares/token.auth");
const basicAuth = require("./middlewares/basic.auth");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", tokenAuth, require("./routes/admin.routes"));
app.use("/api/v1", basicAuth, require("./routes/user.routes"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
