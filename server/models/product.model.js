const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    subcategory: {
      type: mongoose.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["dona", "kg", "litr", "sm"],
    },
    unit_description: {
      type: String,
      default: "",
    },
    expiration: {
      type: Number,
      default: null,
    },
    additionals: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["available", "not_available"],
      default: "available",
    },
    selling_price: {
      type: Number,
      required: true,
    },
    discount_log: {
      type: [
        {
          start_date: {
            type: Date,
            default: Date.now,
          },
          end_date: {
            type: Date,
            default: null,
          },
          percent: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
          },
          status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
          },
        },
      ],
      default: [],
    },
    total_stock: {
      type: Number,
      default: 0,
    },
    stock_log: {
      type: [
        {
          stock: {
            type: Number,
            required: true,
          },
          mfg_date: {
            type: Date,
            required: true,
          },
        },
      ],
      default: [],
    },
    image_log: {
      type: [
        {
          image_url: {
            type: String,
            required: true,
          },
          isMain: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
    product_description: {
      type: String,
      default: null,
    },
    product_ingredients: {
      type: String,
      default: null,
    },
    nutritional_value: {
      type: {
        kkal: {
          type: Number,
          default: null,
        },
        fat: {
          type: Number,
          default: null,
        },
        protein: {
          type: Number,
          default: null,
        },
        uglevod: {
          type: Number,
          default: null,
        },
      },
      default: {
        kkal: null,
        fat: null,
        protein: null,
        uglevod: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
