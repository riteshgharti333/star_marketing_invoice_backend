import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Product } from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// CREATE product
export const createproduct = catchAsyncError(async (req, res, next) => {
  const { name, price, unit, discount, totalAmount } = req.body;

  if (!name) {
    throw new ErrorHandler("Product name is required!", 400);
  }

  const existingProduct = await Product.findOne({ name });

  if (existingProduct) {
    throw new ErrorHandler("Product with this name already exists", 400);
  }

  const product = await Product.create({
    name,
    price,
    unit,
    discount,
    totalAmount,
  });

  res.status(201).json({
    result: 1,
    message: "Product created successfully",
    product,
  });
});

// GET SINGLE product
export const getProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }

  res.status(200).json({
    result: 1,
    product,
  });
});

// GET ALL productS
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    result: 1,
    products,
  });
});

// UPDATE product
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, unit } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }

  product.name = name || product.name;
  product.price = price || product.price;
  product.unit = unit || product.unit;

  await Product.save();

  res.status(200).json({
    result: 1,
    message: "Product updated successfully",
    product,
  });
});

// DELETE product
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }

  await Product.deleteOne();

  res.status(200).json({
    result: 1,
    message: "product deleted successfully",
  });
});

// SEARCH productS BY NAME
export const searchProductsByName = catchAsyncError(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    const products = await Product.find();
    return res.status(200).json({
      result: 1,
      products,
    });
  }

  const products = await Product.find({
    $or: [{ name: { $regex: query, $options: "i" } }],
  });

  if (products.length === 0) {
    return res.status(404).json({
      result: 0,
      message: "No products found with that name",
    });
  }

  res.status(200).json({
    result: 1,
    products,
  });
});
