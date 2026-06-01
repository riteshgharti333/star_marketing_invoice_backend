import mongoose from "mongoose";
import dotenv from "dotenv";
import { Customer } from "../models/customerModel.js";
import { Product } from "../models/productModel.js";
import { Quotation } from "../models/quotationModel.js";

dotenv.config({ path: "../data/config.env" });

console.log(process.env.MONGODB_URL);

// Helper function to generate random date within a range
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

// Helper function to generate random number
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random items from array
const getRandomItems = (arr, min, max) => {
  const count = randomNumber(min, max);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedQuotations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    // Fetch all customers and products from database
    const customers = await Customer.find();
    const products = await Product.find();

    if (customers.length === 0) {
      throw new Error("No customers found. Please seed customers first.");
    }

    if (products.length === 0) {
      throw new Error("No products found. Please seed products first.");
    }

    console.log(
      `Found ${customers.length} customers and ${products.length} products`,
    );

    // Delete existing quotations
    await Quotation.deleteMany();

    const quotations = [];

    // Generate 50 random quotations
    for (let i = 0; i < 50; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];

      // Get 1-4 random products for this quotation
      const selectedProducts = getRandomItems(products, 1, 4);

      const productItems = selectedProducts.map((product) => {
        const quantity = randomNumber(1, 5);
        const unitPrice = product.price;
        const discount = Math.random() > 0.5 ? randomNumber(5, 25) : 0;
        const discountType = Math.random() > 0.5 ? "%" : "₹";

        let totalAmount;
        if (discountType === "%") {
          totalAmount = unitPrice * quantity * (1 - discount / 100);
        } else {
          totalAmount = unitPrice * quantity - discount;
        }
        // Ensure total amount is never negative
        totalAmount = Math.max(0, Math.round(totalAmount * 100) / 100);

        return {
          productId: product._id,
          name: product.name,
          quantity,
          unitPrice,
          discount,
          discountType,
          totalAmount,
        };
      });

      // Calculate subtotal
      const subtotal = productItems.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
      );

      // Extra discount logic
      const extraDiscount = Math.random() > 0.7 ? randomNumber(100, 1000) : 0;
      const extraDiscountType = Math.random() > 0.5 ? "%" : "₹";

      // Calculate total discount
      let totalDiscount = productItems.reduce((sum, item) => {
        if (item.discountType === "₹") {
          return sum + item.discount;
        } else {
          return sum + (item.unitPrice * item.quantity * item.discount) / 100;
        }
      }, 0);

      let finalTotalAmount = subtotal;
      if (extraDiscount > 0) {
        if (extraDiscountType === "%") {
          const discountAmount = subtotal * (extraDiscount / 100);
          finalTotalAmount = Math.max(0, subtotal - discountAmount);
          totalDiscount += discountAmount;
        } else {
          finalTotalAmount = Math.max(0, subtotal - extraDiscount);
          totalDiscount += extraDiscount;
        }
      }

      finalTotalAmount = Math.round(finalTotalAmount * 100) / 100;
      totalDiscount = Math.round(totalDiscount * 100) / 100;

      // Generate dates - FIXED: Use correct variable name quotationDate
      const quotationDate = randomDate(
        new Date("2024-01-01"),
        new Date("2025-12-31"),
      );
      const validUntil = new Date(quotationDate);
      validUntil.setDate(validUntil.getDate() + randomNumber(15, 45));

      // Status logic
      const statusOptions = ["draft", "sent", "accepted", "rejected"];
      const statusWeights = [0.1, 0.4, 0.4, 0.1]; // 10% draft, 40% sent, 40% accepted, 10% rejected

      let status;
      const random = Math.random();
      if (random < statusWeights[0]) status = "draft";
      else if (random < statusWeights[0] + statusWeights[1]) status = "sent";
      else if (random < statusWeights[0] + statusWeights[1] + statusWeights[2])
        status = "accepted";
      else status = "rejected";

      // References
      const references = [
        `QTN-${String(i + 1).padStart(4, "0")}`,
        `QUO-${Date.now().toString().slice(-6)}-${i}`,
        `QT${randomNumber(1000, 9999)}`,
        `EST-${String(randomNumber(1, 999)).padStart(3, "0")}`,
      ];

      const notesOptions = [
        "Thank you for your inquiry!",
        "Prices valid for 15 days",
        "Please review and let us know if you have any questions",
        "This quotation is subject to our terms and conditions",
        "Custom solutions available upon request",
        "Bulk discount available for larger orders",
        "Installation charges not included",
        "",
      ];

      const termsOptions = [
        "Quotation valid for 15 days from the date of issue",
        "50% advance payment required to start work",
        "All prices are in INR and subject to change without notice",
        "Delivery timeline will be confirmed after order confirmation",
        "Any modifications after approval will be charged extra",
        "All prices exclusive of GST",
        "Project scope as discussed and agreed upon",
      ];

      // Create quotation object with only the fields that exist in your model
      const quotationData = {
        customer: customer._id,
        products: productItems,
        quotationDate: quotationDate, // FIXED: Correct field name
        validUntil,
        reference: references[Math.floor(Math.random() * references.length)],
        notes: notesOptions[Math.floor(Math.random() * notesOptions.length)],
        terms: termsOptions[Math.floor(Math.random() * termsOptions.length)],
        extraDiscount,
        extraDiscountType,
        totalAmount: finalTotalAmount,
        totalDiscount,
        status,
      };

      quotations.push(quotationData);
    }

    // Insert all quotations
    const createdQuotations = await Quotation.insertMany(quotations);

    // Update customers with quotation IDs (if your Customer model has quotationId field)
    for (const quotation of createdQuotations) {
      await Customer.findByIdAndUpdate(quotation.customer, {
        $push: { quotationId: quotation._id },
      });
    }

    console.log(
      `✅ ${createdQuotations.length} quotations inserted successfully`,
    );
    console.log(`📊 Summary:`);
    console.log(
      `   - Total Amount: ₹${quotations.reduce((sum, quo) => sum + quo.totalAmount, 0).toFixed(2)}`,
    );
    console.log(
      `   - Draft: ${createdQuotations.filter((q) => q.status === "draft").length}`,
    );
    console.log(
      `   - Sent: ${createdQuotations.filter((q) => q.status === "sent").length}`,
    );
    console.log(
      `   - Accepted: ${createdQuotations.filter((q) => q.status === "accepted").length}`,
    );
    console.log(
      `   - Rejected: ${createdQuotations.filter((q) => q.status === "rejected").length}`,
    );

    // Show some sample quotations
    console.log(`\n📋 Sample Quotations:`);
    createdQuotations.slice(0, 5).forEach((quo, idx) => {
      console.log(
        `   ${idx + 1}. ${quo.reference} - ₹${quo.totalAmount} (Status: ${quo.status})`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedQuotations();
