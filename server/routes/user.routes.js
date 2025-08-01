const express = require("express");
const {
  createOrder,
  getOrdersByUser,
  getActualOrdersByUser,
  cancelOrder,
} = require("../controllers/order.controller");
const {
  createUser,
  getUserByQuery,
} = require("../controllers/user.controller");

const rt = express.Router();

rt.post("/order/create", createOrder);
rt.get("/order/user/get", getOrdersByUser);
rt.get("/order/user/get/actual", getActualOrdersByUser);
rt.put("/order/cancel", cancelOrder);

rt.post("/user/create", createUser);
rt.get("/user/get", getUserByQuery);

module.exports = rt;
