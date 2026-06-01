import mongoose from "mongoose";
import { Invoice } from "./models/invoiceModel.js";
import "./models/customerModel.js";
import "./models/bankModel.js";
import "./models/sigModel.js";
import { config } from "dotenv";

config({
  path: "./data/config.env",
});

await mongoose.connect(process.env.MONGODB_URL);

const runs = 10;
let totalTime = 0;

for (let i = 0; i < runs; i++) {
  const start = performance.now();

  await Invoice.findById("68675940b2f83d62738ec6a9")
    .populate("customer", "name email")
    .populate("bank", "bankName accountNumber")
    .populate("signature", "name");
  // .lean();

  const end = performance.now();
  totalTime += end - start;
}

console.log(`Average fetch time: ${(totalTime / runs).toFixed(2)}ms`);
