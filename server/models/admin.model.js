const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    admin_login: {
      type: String,
      required: true,
    },
    admin_password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
