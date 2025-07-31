const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_phone: {
      type: String,
      required: true,
      match: /^\d{9}$/,
      default: null,
    },
    user_gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    telegram_id: {
      type: String,
      required: true,
    },
    wishes: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      ],
      default: [],
    },
    default_address: {
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

module.exports = mongoose.model("User", UserSchema);
