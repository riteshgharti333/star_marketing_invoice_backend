import { Quotation } from "../models/quotationModel.js";
import { Customer } from "../models/customerModel.js";
import { Signature } from "../models/sigModel.js";
import { Bank } from "../models/bankModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// CREATE Quotation
export const createQuotation = catchAsyncError(async (req, res, next) => {
  const {
    customer,
    bank,
    signature,
    products,
    quotationDate,
    dueDate,
    reference,
    notes,
    terms,
    extraDiscount,
    extraDiscountType,
    totalAmount,
    totalDiscount,
    amountBalance,
    payments,
  } = req.body;

  if (!customer) {
    throw new ErrorHandler("Customer is required!", 400);
  }

  if (!products) {
    throw new ErrorHandler("Product is required!", 400);
  }

  if (products.length === 0) {
    throw new ErrorHandler("Minimum one product is required!", 400);
  }

  if (!quotationDate) {
    throw new ErrorHandler("Quotation date is required!", 400);
  }

  // Find customer with full details
  const foundCustomer = await Customer.findById(customer);
  if (!foundCustomer) throw new ErrorHandler("Customer not found", 404);

  // Find bank with full details (if bank is provided)
  let foundBank = null;
  if (bank) {
    foundBank = await Bank.findById(bank);
    if (!foundBank) throw new ErrorHandler("Bank not found", 404);
  }

  let foundSig = null;

  if (signature) {
    foundSig = await Signature.findById(signature);
    if (!foundSig) throw new ErrorHandler("signature not found", 404);
  }

  // Create the Quotation with full customer and bank details
  const quotation = await Quotation.create({
    customer: foundCustomer,
    bank: foundBank,
    signature: foundSig,
    products,
    quotationDate,
    dueDate,
    reference,
    notes,
    terms,
    extraDiscount,
    extraDiscountType,
    totalAmount,
    amountBalance,
    totalDiscount,
    payments,
  });

  foundCustomer.quotationId.push(quotation._id);
  await foundCustomer.save();

  res.status(201).json({
    result: 1,
    message: "Quotation created successfully",
    quotation,
  });
});

// GET ALL Quotations

export const getAllQuotation = catchAsyncError(async (req, res, next) => {
  const quotation = await Quotation.find()
    .sort({ createdAt: -1 })
    .populate("customer")
    .populate("bank")
    .populate("signature");

  res.status(200).json({
    result: 1,
    quotation,
  });
});

// GET SINGLE Quotation BY ID
export const getQuotation = catchAsyncError(async (req, res, next) => {
  const quotation = await Quotation.findById(req.params.id)
    .populate("customer")
    .populate("bank")
    .populate("signature");

  if (!quotation) {
    throw new ErrorHandler("Quotation not found", 404);
  }

  res.status(200).json({
    result: 1,
    quotation,
  });
});

// UPDATE Quotation
export const updateQuotation = catchAsyncError(async (req, res, next) => {
  const quotation = await Quotation.findById(req.params.id);

  if (!quotation) {
    throw new ErrorHandler("Quotation not found", 404);
  }

  const updates = req.body;
  Object.assign(quotation, updates);
  await quotation.save();

  res.status(200).json({
    result: 1,
    message: "Quotation updated successfully",
    quotation,
  });
});

// DELETE Quotation
export const deleteQuotation = catchAsyncError(async (req, res, next) => {
  const quotation = await Quotation.findById(req.params.id);

  if (!quotation) {
    throw new ErrorHandler("Quotation not found", 404);
  }

  await quotation.deleteOne();

  res.status(200).json({
    result: 1,
    message: "Quotation deleted successfully",
  });
});



// SEARCH INVOICES BY CUSTOMER NAME
export const searchQuotationByCustomerName = catchAsyncError(async (req, res, next) => {
  const searchQuery = req.query.name?.trim();

  if (!searchQuery) {
    throw new ErrorHandler("Customer name query is required", 400);
  }

  // Step 1: Find invoices with populated customer
  const invoices = await Quotation.find()
    .populate({
      path: "customer",
      match: { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive match
    })
    .populate("bank")
    .populate("signature");

  // Step 2: Filter out invoices where customer was not matched
  const matchedInvoices = invoices.filter(inv => inv.customer !== null);

  res.status(200).json({
    result: 1,
    invoices: matchedInvoices,
  });
});