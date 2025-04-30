import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    upiId: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export const Bank = mongoose.model("Bank", bankSchema);
