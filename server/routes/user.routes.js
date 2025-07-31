const express = require("express");
const {
  createOrder,
  getOrdersByUser,
  getActualOrdersByUser,
  cancelOrder,
} = require("../controllers/order.controller");

const rt = express.Router();

rt.post("/order/create", createOrder);
rt.get("/order/user/get", getOrdersByUser);
rt.get("/order/user/get/actual", getActualOrdersByUser);
rt.put("/order/cancel", cancelOrder);

module.exports = rt;
