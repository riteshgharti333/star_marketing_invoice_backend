import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Bank } from "../models/bankModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// CREATE BANK
export const createBank = catchAsyncError(async (req, res, next) => {
  const {
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    upiId,
  } = req.body;

  if (
    !accountHolderName ||
    !accountNumber ||
    !ifscCode ||
    !bankName ||
    !branchName
  ) {
    throw new ErrorHandler("All bank details are required!", 400);
  }

  const bank = await Bank.create({
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    upiId,
  });

  res.status(201).json({
    result: 1,
    message: "Bank account created successfully",
    bank,
  });
});

// GET SINGLE BANK
export const getBankById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const bank = await Bank.findById(id);

  if (!bank) {
    throw new ErrorHandler("Bank account not found", 404);
  }

  res.status(200).json({
    result: 1,
    bank,
  });
});

// GET ALL BANKS
export const getAllBanks = catchAsyncError(async (req, res, next) => {
  const banks = await Bank.find().sort({ createdAt: -1 });

  res.status(200).json({
    result: 1,
    count: banks.length,
    banks,
  });
});

// UPDATE BANK
export const updateBank = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const bank = await Bank.findById(id);

  if (!bank) {
    throw new ErrorHandler("Bank account not found", 404);
  }

  const updates = req.body;
  Object.assign(bank, updates);
  await bank.save();

  res.status(200).json({
    result: 1,
    message: "Bank account updated successfully",
    bank,
  });
});

// DELETE BANK
export const deleteBank = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const bank = await Bank.findByIdAndDelete(id);

  if (!bank) {
    throw new ErrorHandler("Bank account not found", 404);
  }

  res.status(200).json({
    result: 1,
    message: "Bank account deleted successfully",
  });
});

// SEARCH BANK
export const searchBank = catchAsyncError(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    const banks = await Bank.find();
    return res.status(200).json({
      result: 1,
      banks,
    });
  }

  const banks = await Bank.find({
    $or: [
      { accountHolderName: { $regex: query, $options: "i" } },
      { accountNumber: { $regex: query, $options: "i" } },
    ],
  });

  if (banks.length === 0) {
    return res.status(404).json({
      result: 0,
      message: "No bank acvount found",
    });
  }

  res.status(200).json({
    result: 1,
    banks,
  });
});
