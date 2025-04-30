import { Invoice } from "../models/invoiceModel.js";
import { Customer } from "../models/customerModel.js";
import { Signature } from "../models/sigModel.js";
import { Bank } from "../models/bankModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// CREATE INVOICE
export const createInvoice = catchAsyncError(async (req, res, next) => {
  const {
    customer,
    bank,
    signature,
    products,
    invoiceDate,
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

  if (!invoiceDate) {
    throw new ErrorHandler("Invoice date is required!", 400);
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

  // Create the invoice with full customer and bank details
  const invoice = await Invoice.create({
    customer: foundCustomer,
    bank: foundBank,
    signature: foundSig,
    products,
    invoiceDate,
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

  res.status(201).json({
    result: 1,
    message: "Invoice created successfully",
    invoice,
  });
});

// GET ALL INVOICES
export const getAllInvoices = catchAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find()
    .populate("customer")
    .populate("bank")
    .populate("signature");

  res.status(200).json({
    result: 1,
    invoices,
  });
});

// GET SINGLE INVOICE BY ID
export const getInvoice = catchAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("customer")
    .populate("bank")
    .populate("signature");

  if (!invoice) {
    throw new ErrorHandler("Invoice not found", 404);
  }

  res.status(200).json({
    result: 1,
    invoice,
  });
});

// UPDATE INVOICE
export const updateInvoice = catchAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ErrorHandler("Invoice not found", 404);
  }

  const updates = req.body;
  Object.assign(invoice, updates);
  await invoice.save();

  res.status(200).json({
    result: 1,
    message: "Invoice updated successfully",
    invoice,
  });
});

// DELETE INVOICE
export const deleteInvoice = catchAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ErrorHandler("Invoice not found", 404);
  }

  await invoice.deleteOne();

  res.status(200).json({
    result: 1,
    message: "Invoice deleted successfully",
  });
});
