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
    const decoded = JSON.parse(atob(credentials));

    if (!decoded?.telegram_id) {
      return res.status(401).json({
        message: "Avtorizatsiya ma'lumotlarida telegram_id mavjud emas",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Avtorizatsiya ma'lumotlari noto'g'ri" });
  }
};

module.exports = basicAuth;
