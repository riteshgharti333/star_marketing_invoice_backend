import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model("Customer", customerSchema);
