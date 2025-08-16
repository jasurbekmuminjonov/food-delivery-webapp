const User = require("../models/user.model");

exports.createUser = async (req, res) => {
  try {
    const { telegram_id } = req.body;
    const user = await User.findOne({ telegram_id });
    if (!user) {
      await User.create(req.body);
    } else {
      await User.findOneAndUpdate({ telegram_id }, req.body);
    }
    res.status(201).json({ message: "Foydalanuvchi saqlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.userBlockingToggle = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      message: `Foydalanuvchi ${
        user.isBlocked ? "bloklandi" : "blokdan chiqarildi"
      }`,
      user,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getUserByQuery = async (req, res) => {
  try {
    const { telegram_id, user_phone } = req.query;

    if (!telegram_id && !user_phone) {
      return res
        .status(400)
        .json({ message: "Iltimos, telegram_id yoki user_phone yuboring" });
    }

    const filter = telegram_id ? { telegram_id } : { user_phone };

    const user = await User.findOne(filter);

    if (!user) {
      return res.status(400).json({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
