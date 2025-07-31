const express = require("express");
const { createAdmin, loginAdmin } = require("../controllers/admin.controller");
const {
  createCourier,
  loginCourier,
  getCouriers,
  editCourier,
  editCourierPassword,
} = require("../controllers/courier.controller");
const {
  createProduct,
  getProducts,
  editProduct,
  inserImageToProduct,
  deleteImageInProduct,
  setImageToMain,
  createDiscountForProduct,
  removeDiscountInProduct,
  createStockForProduct,
  searchProducts,
} = require("../controllers/product.controller");

const {
  createCategory,
  createSubcategory,
  getCategories,
} = require("../controllers/category.controller");
const {
  getOrders,
  getActualOrders,
  setCourierToOrder,
  completePreparing,
  completeDelivering,
  cancelOrder,
} = require("../controllers/order.controller");
const upload = require("../middlewares/upload");
const rt = express.Router();

rt.post("/admin/create", createAdmin);
rt.post("/admin/login", loginAdmin);

rt.post("/courier/create", createCourier);
rt.post("/courier/login", loginCourier);
rt.get("/courier/get", getCouriers);
rt.put("/courier/:id", editCourier);
rt.put("/courier/password", editCourierPassword);

rt.post("/product/create", upload.array("image_log"), createProduct);
rt.get("/product/get", getProducts);
rt.put("/product/:id", editProduct);
rt.post("/product/image/:id", upload.single("image"), inserImageToProduct);
rt.delete("/product/image", deleteImageInProduct);
rt.put("/product/image/main", setImageToMain);
rt.post("/product/discount/:id", createDiscountForProduct);
rt.delete("/product/discount", removeDiscountInProduct);
rt.post("/product/stock/:id", createStockForProduct);
rt.get("/product/search", searchProducts);

rt.post("/category/create", createCategory);
rt.post("/subcategory/create", createSubcategory);
rt.get("/category/get", getCategories);

rt.get("/order/get", getOrders);
rt.get("/order/get/actual", getActualOrders);
rt.put("/order/set/courier", setCourierToOrder);
rt.put("/order/complete/preparing", completePreparing);
rt.put("/order/complete/delivering", completeDelivering);
rt.put("/order/cancel", cancelOrder);

module.exports = rt;
