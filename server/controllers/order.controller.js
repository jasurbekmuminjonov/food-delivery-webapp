const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

exports.createOrder = async (req, res) => {
  try {
    const { telegram_id } = req.user;
    console.log(req.user);

    const { products, delivery_fee } = req.body;
    const user = await User.findOne({ telegram_id });
    if (!user) {
      return res.status(400).json({
        message:
          "Avtorizatsiya xatosi. Telegram botga /start buyrug'ini bering",
      });
    }
    const totalPrice = products.reduce(
      (acc, p) => acc + p.quantity * p.sale_price,
      0
    );
    // for (const item of products) {
    //   await Product.findByIdAndUpdate(item.product_id, {
    //     $inc: { total_stock: -item.quantity },
    //   });
    // }

    req.body.total_price = totalPrice + delivery_fee;
    req.body.user_id = user._id;
    await Order.create(req.body);
    res
      .status(201)
      .json({ message: "Buyurtma yaratildi, kuryer yetkazishini kuting" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
exports.getCourierOrders = async (req, res) => {
  try {
    const orders = await Order.find({ courier_id: req.user.id });
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { telegram_id } = req.user;
    const user = await User.findOne({ telegram_id });
    if (!user) {
      return res.status(400).json({
        message:
          "Avtorizatsiya xatosi. Telegram botga /start buyrug'ini bering",
      });
    }
    const orders = await Order.find({ user_id: user._id }).populate(
      "courier_id"
    );
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getActualOrdersByUser = async (req, res) => {
  try {
    const { telegram_id } = req.user;
    const user = await User.findOne({ telegram_id });
    if (!user) {
      return res.status(400).json({
        message:
          "Avtorizatsiya xatosi. Telegram botga /start buyrug'ini bering",
      });
    }
    const orders = await Order.find({
      user_id: user._id,
      status: { $nin: ["completed", "canceled"] },
    });
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getActualOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $nin: ["completed", "canceled"] },
    });
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.setCourierToOrder = async (req, res) => {
  try {
    const { order, courier } = req.query;
    await Order.findByIdAndUpdate(order, { $set: { courier_id: courier } });
    res.status(200).json({ message: "Buyurtmaga kuryer bog'landi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.completePreparing = async (req, res) => {
  try {
    const { id } = req.params;
    const { courier_id } = req.body;
    await Order.findByIdAndUpdate(id, {
      $set: {
        order_status: "delivering",
        courier_id,
        prepared_date: Date.now(),
      },
    });
    res.status(200).json({ message: "Buyurtma yetkazishga tayyorlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.completeDelivering = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, {
      $set: {
        order_status: "completed",
        payment_method: req.body.payment_method,
        delivered_date: Date.now(),
      },
    });
    res.status(200).json({ message: "Buyurtma yetkazildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const { cancellation_reason, order_id } = req.body;
    await Order.findByIdAndUpdate(order_id, {
      $set: {
        order_status: "canceled",
        cancellation_reason,
        canceled_date: Date.now(),
      },
    });
    // for (const item of order.products) {
    //   await Product.findByIdAndUpdate(item.product_id, {
    //     $inc: { total_stock: item.quantity },
    //   });
    // }
    res.status(200).json({ message: "Buyurtma yetkazishga tayyorlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
