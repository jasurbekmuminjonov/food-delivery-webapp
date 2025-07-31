const Courier = require("../models/courier.model");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../services/user.service");

exports.createCourier = async (req, res) => {
  try {
    const { courier_login, courier_password } = req.body;
    const courier = await Courier.findOne({ courier_login });
    if (courier) {
      return res.status(400).json({
        message: `${courier_login} telefon raqami bilan kuryer avval qo'shilgan`,
      });
    }
    const hashed = await hashPassword(courier_password);
    courier_password = hashed;
    await Courier.create(req.body);
    res.status(200).json({ message: "Kuryer yaratildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getCouriers = async (req, res) => {
  try {
    const couriers = await Courier.find();
    res.status(200).json(couriers);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.editCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const { courier_name, courier_login, courier_gender } = req.body;
    await Courier.findByIdAndUpdate(id, {
      courier_name,
      courier_login,
      courier_gender,
    });
    res.status(200).json({ message: "Kuryer tahrirlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.editCourierPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { courier_password } = req.body;
    const hashed = await hashPassword(courier_password);
    await Courier.findByIdAndUpdate(id, { courier_password: hashed });
    res.status(200).json({ message: "Kuryerning paroli tahrirlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.loginCourier = async (req, res) => {
  try {
    const { courier_login, courier_password } = req.body;
    const courier = await Courier.findOne({ courier_login });
    if (!courier) {
      return res.status(400).json({ message: "Login xato" });
    }
    const isMatch = await comparePassword(
      courier_password,
      courier.courier_password
    );
    if (!isMatch) {
      return res.status(200).json({ message: "Parol xato" });
    }
    const token = generateToken(courier, "courier");
    res.status(200).json(token);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
