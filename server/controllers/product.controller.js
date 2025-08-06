const Product = require("../models/product.model");

exports.createProduct = async (req, res) => {
  try {
    const files = req.files || [];

    const productImages = files.map((item, index) => ({
      image_url: `http://localhost:8080/images/${item.filename}`,
      isMain: index === 0,
    }));

    const {
      product_name,
      category,
      subcategory,
      unit,
      unit_description,
      expiration,
      selling_price,
      product_description,
      product_ingredients,
      additionals,
      "nutritional_value.kkal": kkal,
      "nutritional_value.protein": protein,
      "nutritional_value.fat": fat,
      "nutritional_value.uglevod": uglevod,
    } = req.body;

    const parsedProduct = {
      product_name,
      category,
      subcategory,
      unit,
      unit_description,
      expiration: Number(expiration),
      selling_price: Number(selling_price),
      product_description,
      product_ingredients,
      additionals: Array.isArray(additionals)
        ? additionals
        : additionals
        ? [additionals]
        : [],
      nutritional_value: {
        kkal: Number(kkal),
        protein: Number(protein),
        fat: Number(fat),
        uglevod: Number(uglevod),
      },
      image_log: productImages,
    };

    const product = await Product.create(parsedProduct);

    res.status(201).json({ message: "Tovar yaratildi", product });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("subcategory");
    res.status(200).json(products);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      product_name,
      category,
      subcategory,
      unit,
      unit_description,
      expiration,
      selling_price,
      product_description,
      product_ingredients,
      additionals,
      "nutritional_value.kkal": kkal,
      "nutritional_value.protein": protein,
      "nutritional_value.fat": fat,
      "nutritional_value.uglevod": uglevod,
    } = req.body;

    const updatedProduct = {
      product_name,
      category,
      subcategory,
      unit,
      unit_description,
      expiration: Number(expiration),
      selling_price: Number(selling_price),
      product_description,
      product_ingredients,
      additionals: Array.isArray(additionals)
        ? additionals
        : additionals
        ? [additionals]
        : [],
      nutritional_value: {
        kkal: Number(kkal),
        protein: Number(protein),
        fat: Number(fat),
        uglevod: Number(uglevod),
      },
    };

    await Product.findByIdAndUpdate(id, updatedProduct);

    res.status(200).json({ message: "Tovar tahrirlandi" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.inserImageToProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      image_url: `http://localhost:8080/images/${req.file.filename}`,
      isMain: false,
    };
    await Product.findByIdAndUpdate(id, { $push: { image_log: payload } });
    res.status(200).json({ message: "Tovarga rasm qo'shildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.deleteImageInProduct = async (req, res) => {
  try {
    const { product, image } = req.query;

    const editingProduct = await Product.findById(product);
    if (!editingProduct) {
      return res.status(400).json({ message: "Tovar topilmadi" });
    }

    const imageIndex = Number(image);
    if (
      isNaN(imageIndex) ||
      imageIndex < 0 ||
      imageIndex >= editingProduct.image_log.length
    ) {
      return res.status(400).json({ message: "Rasm indeksi noto'g'ri" });
    }

    editingProduct.image_log = editingProduct.image_log.filter(
      (_, index) => index !== imageIndex
    );

    await editingProduct.save();

    res.status(200).json({ message: "Tovardagi rasm o'chirildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.setImageToMain = async (req, res) => {
  try {
    const { product, image } = req.query;

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(400).json({ message: "Tovar topilmadi" });
    }

    const imageIndex = Number(image);
    if (
      isNaN(imageIndex) ||
      imageIndex < 0 ||
      imageIndex >= productDoc.image_log.length
    ) {
      return res.status(400).json({ message: "Rasm indeksi noto'g'ri" });
    }

    productDoc.image_log.forEach((item, index) => {
      item.isMain = index === imageIndex;
    });

    await productDoc.save();

    res.status(200).json({ message: "Asosiy rasm belgilandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.createDiscountForProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { percent } = req.body;
    await Product.findById(id, { $push: { discount_log: { percent } } });
    res.status(200).json({ message: "Tovar uchun chegirma qo'shildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.removeDiscountInProduct = async (req, res) => {
  try {
    const { product, discount } = req.query;

    const editingProduct = await Product.findById(product);
    if (!editingProduct) {
      return res.status(400).json({ message: "Tovar topilmadi" });
    }

    const editingDiscount = editingProduct.discount_log.find(
      (item) => item._id?.toString() === discount
    );

    if (!editingDiscount) {
      return res.status(400).json({ message: "Chegirma topilmadi" });
    }

    editingDiscount.status = "inactive";    
    editingDiscount.end_date = new Date();
    await editingProduct.save();

    res.status(200).json({ message: "Tovardan chegirma olib tashlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.createStockForProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, mfg_date } = req.body;
    await Product.findByIdAndUpdate(id, {
      $push: { stock_log: { stock, mfg_date } },
      $inc: { total_stock: stock },
    });
    res.status(200).json({ message: "Tovar miqdori orttirildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ message: "So'rov bo'sh bo'lishi mumkin emas" });

    const regex = new RegExp(q, "i");

    const products = await Product.find({
      $or: [
        { product_name: regex },
        { product_description: regex },
        { additionals: regex },
      ],
    })
      .populate("subcategory", "subcategory")
      .populate("category", "category")
      .lean();

    const enriched = products.map((p) => {
      let score = 0;
      if (p.product_name?.toLowerCase().includes(q.toLowerCase())) score += 3;
      if (p.product_description?.toLowerCase().includes(q.toLowerCase()))
        score += 2;
      if (p.additionals?.some((a) => a.toLowerCase().includes(q.toLowerCase())))
        score += 2;
      if (p.subcategory?.subcategory?.toLowerCase().includes(q.toLowerCase()))
        score += 1;
      if (p.category?.category?.toLowerCase().includes(q.toLowerCase()))
        score += 1;

      return { ...p, score };
    });

    enriched.sort((a, b) => b.score - a.score);

    res.status(200).json(enriched);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Serverda xatolik", err });
  }
};
