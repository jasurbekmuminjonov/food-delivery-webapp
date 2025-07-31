const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema(
  {
    market_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Market", MarketSchema);
