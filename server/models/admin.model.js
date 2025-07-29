const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    admin_name: {
      type: String,
      required: true,
    },
    supermarket_id: {
      type: mongoose.Types.ObjectId,
      ref: "Supermarket",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
