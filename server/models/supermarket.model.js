const mongoose = require("mongoose");

const SupermarketSchema = new mongoose.Schema(
  {
    supermarket_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supermarket", SupermarketSchema);
