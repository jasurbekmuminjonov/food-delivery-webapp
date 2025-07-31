const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product_id: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          sale_price: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [],
    },
    total_price: {
      type: Number,
      required: true,
    },
    order_status: {
      type: String,
      enum: ["preparing", "delivering", "completed", "canceled"],
      default: "preparing",
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    prepared_date: {
      type: Date,
      default: null,
    },
    delivered_date: {
      type: Date,
      default: null,
    },
    canceled_date: {
      type: Date,
      default: null,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courier_id: {
      type: mongoose.Types.ObjectId,
      ref: "Courier",
      default: null,
    },
    order_address: {
      type: {
        lat: {
          type: Number,
          required: true,
        },
        long: {
          type: Number,
          required: true,
        },
      },
      default: {
        lat: null,
        long: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
