const Admin = require("../models/admin.model");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../services/user.service");

exports.createAdmin = async (req, res) => {
  try {
    const { admin_password } = req.body;
    const hashed = await hashPassword(admin_password);
    admin_password = hashed;
    await Admin.create(req.body);
    res.status(201).json({ message: "Admin yaratildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { admin_login, admin_password } = req.body;
    const admin = await Admin.findOne({ admin_login });
    if (!admin) {
      return res.status(400).json({ message: "Login xato" });
    }
    const isMatch = await comparePassword(admin_password, admin.admin_password);
    if (!isMatch) {
      return res.status(400).json({ message: "Parol xato" });
    }
    const token = generateToken(user, "admin");
    res.status(200).json(token);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
