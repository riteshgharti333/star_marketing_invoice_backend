import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      trim: true,
    },
    unit: {
      type: Number,
      trim: true,
    },
    discount: {
      type: Number,
      trim: true,
    },
    totalAmount: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
