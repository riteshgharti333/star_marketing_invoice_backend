import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Customer } from "../models/customerModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// CREATE CUSTOMER
export const createCustomer = catchAsyncError(async (req, res, next) => {
  const { name, phone, email } = req.body;

  if (!name) {
    throw new ErrorHandler("Name is required!", 400);
  }

  const existingCustomer = await Customer.findOne({ name });

  if (existingCustomer) {
    throw new ErrorHandler("Customer with this name already exists", 400);
  }

  const customer = await Customer.create({ name, phone, email });

  res.status(201).json({
    result: 1,
    message: "Customer created successfully",
    customer,
  });
});

// GET SINGLE CUSTOMER
export const getCustomer = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ErrorHandler("Customer not found", 404);
  }

  res.status(200).json({
    result: 1,
    customer,
  });
});

// GET ALL CUSTOMERS
export const getAllCustomers = catchAsyncError(async (req, res, next) => {
  const customers = await Customer.find().sort({ createdAt: -1 });

  res.status(200).json({
    result: 1,
    customers,
  });
});

// UPDATE CUSTOMER
export const updateCustomer = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ErrorHandler("Customer not found", 404);
  }

  customer.name = name || customer.name;
  customer.phone = phone || customer.phone;
  customer.email = email || customer.email;

  await customer.save();

  res.status(200).json({
    result: 1,
    message: "Customer updated successfully",
    customer,
  });
});

// DELETE CUSTOMER
export const deleteCustomer = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ErrorHandler("Customer not found", 404);
  }

  await customer.deleteOne();

  res.status(200).json({
    result: 1,
    message: "Customer deleted successfully",
  });
});

// SEARCH CUSTOMERS BY NAME
export const searchCustomersByName = catchAsyncError(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    const customers = await Customer.find();
    return res.status(200).json({
      result: 1,
      customers,
    });
  }

  const customers = await Customer.find({
    $or: [{ name: { $regex: query, $options: "i" } }],
  });

  if (customers.length === 0) {
    return res.status(404).json({
      result: 0,
      message: "No customers found with that name",
    });
  }

  res.status(200).json({
    result: 1,
    customers,
  });
});
