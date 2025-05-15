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
    moneyReceived,
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
    moneyReceived,
  });

  foundCustomer.invoiceId.push(invoice._id);
  await foundCustomer.save();

  res.status(201).json({
    result: 1,
    message: "Invoice created successfully",
    invoice,
  });
});

// GET ALL INVOICES
export const getAllInvoices = catchAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find()
    .sort({ createdAt: -1 })
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

  const { paymentAmount, paymentDate, paymentMode, notes } = req.body;

  if (!paymentAmount || paymentAmount <= 0) {
    throw new ErrorHandler("Invalid payment amount", 400);
  }

  // Subtract payment from balance
  invoice.amountBalance -= paymentAmount;

  // Prevent negative balance
  if (invoice.amountBalance < 0) {
    invoice.amountBalance = 0;
  }

  // Determine if this payment completes the invoice
  const isFullyPaid = invoice.amountBalance === 0;

  const newPayment = {
    amount: paymentAmount,
    paidAt: paymentDate || new Date(),
    mode: paymentMode,
    notes: notes || "",
    isFullyPaid, // only this payment is updated
  };

  // Push new payment
  invoice.payments.push(newPayment);

  // If invoice is fully paid, set flag
  if (isFullyPaid) {
    invoice.moneyReceived = true;
  }

  await invoice.save();

  res.status(200).json({
    result: 1,
    message: "Invoice updated with payment",
    invoice,
  });
});

// DELETE INVOICE
export const deleteInvoice = catchAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ErrorHandler("Invoice not found", 404);
  }

  const customerId = invoice.customer;
  await invoice.deleteOne();

  if (customerId) {
    await Customer.findByIdAndUpdate(customerId, {
      $pull: { invoiceId: invoice._id },
    });
  }

  res.status(200).json({
    result: 1,
    message: "Invoice deleted successfully",
  });
});

// SEARCH INVOICES BY CUSTOMER NAME
export const searchInvoicesByCustomerName = catchAsyncError(
  async (req, res, next) => {
    const searchQuery = req.query.name?.trim();

    if (!searchQuery) {
      throw new ErrorHandler("Customer name query is required", 400);
    }

    // Step 1: Find invoices with populated customer
    const invoices = await Invoice.find()
      .populate({
        path: "customer",
        match: { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive match
      })
      .populate("bank")
      .populate("signature");

    // Step 2: Filter out invoices where customer was not matched
    const matchedInvoices = invoices.filter((inv) => inv.customer !== null);

    res.status(200).json({
      result: 1,
      invoices: matchedInvoices,
    });
  }
);

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmailWithPdf = async (req, res) => {
  try {
    const { recipientEmail, subject, message } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    await transporter.sendMail({
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: subject || "Your PDF Document",
      text: message || "Please find attached your requested PDF document.",
      attachments: [
        {
          filename: pdfFile.originalname || "document.pdf",
          content: pdfFile.buffer,
        },
      ],
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
