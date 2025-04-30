import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema(
  {
    signatureName: {
      type: String,
      required: true,
    },
    signatureImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Signature = mongoose.model("Signature", signatureSchema);
