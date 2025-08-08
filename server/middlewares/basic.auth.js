const basicAuth = (req, res, next) => {
  const publicPaths = ["/user/create", "/user/get"];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  if (!req.headers.authorization?.startsWith("Basic ")) {
    return res
      .status(401)
      .json({ message: "Avtorizatsiya noto'g'ri formatda" });
  }

  const credentials = req.headers.authorization.split(" ")[1];
  if (!credentials) {
    return res
      .status(401)
      .json({ message: "Avtorizatsiya ma'lumotlari topilmadi" });
  }

  try {
    const decoded = Buffer.from(credentials, "base64").toString("utf8"); // "telegram_id:parol"
    const [telegram_id] = decoded.split(":"); // faqat telegram_id olamiz

    if (!telegram_id) {
      return res.status(401).json({
        message: "Avtorizatsiya ma'lumotlarida telegram_id mavjud emas",
      });
    }

    req.user = { telegram_id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Avtorizatsiya ma'lumotlari noto'g'ri" });
  }
};

module.exports = basicAuth;
