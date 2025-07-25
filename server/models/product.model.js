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
      enum: ["dona", "gr", "litr", "sm"],
    },
    unit_description: {
      type: String,
      default: "",
    },
    expiration: {
      type: Number,
      required: true,
    },
    additionals: {
      type: [String],
      default: [],
    },
    discount_log: {
      type: [
        {
          start_date: {
            type: Date,
            required: true,
          },
          end_date: {
            type: Date,
            required: true,
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
          required: true,
        },
        fat: {
          type: Number,
          required: true,
        },
        protein: {
          type: Number,
          required: true,
        },
        uglevod: {
          type: Number,
          required: true,
        },
      },
      default: null,
    },
    strg_conditions: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
