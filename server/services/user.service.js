const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Parolni hash qilish
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Token yaratish
const generateToken = (user, type) => {
  return jwt.sign({ id: user._id, type: type }, process.env.JWT_SECRET);
};

// Parolni solishtirish
const comparePassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  generateToken,
  comparePassword,
};
