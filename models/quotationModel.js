import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  notes: String,
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  mode: {
    type: String,
    required: true,
  },
  isFullyPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

const productItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  quantity: Number,
  unitPrice: Number,
  discount: Number,
  discountType: {
    type: String,
    enum: ["%", "₹"],
    default: "%",
  },
  totalAmount: Number,
});

const quotationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
  },
  signature: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Signature",
  },
  products: [productItemSchema],
  quotationDate: {
    type: Date,
    required: true,
  },
  dueDate: Date,
  reference: String,
  notes: String,
  terms: String,
  extraDiscount: {
    type: Number,
    default: 0,
  },
  extraDiscountType: {
    type: String,
    enum: ["%", "₹"],
    default: "%",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  totalDiscount: Number,
  amountBalance: Number,

  moneyReceived: {
    type: Boolean,
    default: false,
  },

  payments: [paymentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Quotation = mongoose.model("Quotation", quotationSchema);
