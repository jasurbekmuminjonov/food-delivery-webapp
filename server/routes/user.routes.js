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
const { getProducts } = require("../controllers/product.controller");
const { getCategories } = require("../controllers/category.controller");

const rt = express.Router();

rt.post("/order/create", createOrder);
rt.get("/order/user/get", getOrdersByUser);
rt.get("/order/user/get/actual", getActualOrdersByUser);
rt.put("/order/cancel", cancelOrder);
rt.get("/product/get", getProducts);
rt.get("/category/get", getCategories);

rt.post("/user/create", createUser);
rt.get("/user/get", getUserByQuery);

module.exports = rt;
