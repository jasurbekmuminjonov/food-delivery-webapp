const mongoose = require("mongoose");

const CourierSchema = new mongoose.Schema(
  {
    courier_name: {
      type: String,
      required: true,
    },
    courier_login: {
      type: String,
      required: true,
    },
    courier_phone: {
      type: String,
      required: true,
      match: /^\+998\d{9}$/,
    },
    courier_password: {
      type: String,
      required: true,
    },
    courier_gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courier", CourierSchema);
