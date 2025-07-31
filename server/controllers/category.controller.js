const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");

exports.createCategory = async (req, res) => {
  try {
    await Category.create(req.body);
    res.status(200).json({ message: "Kategoriya yaratildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    await Subcategory.create(req.body);
    res.status(200).json({ message: "Subkategoriya yaratildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "subcategories", 
          localField: "_id",
          foreignField: "category_id",
          as: "subcategories",
        },
      },
      {
        $project: {
          category: 1,
          subcategories: {
            _id: 1,
            subcategory: 1,
          },
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
