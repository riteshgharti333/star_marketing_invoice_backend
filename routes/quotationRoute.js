import express from "express";
import {
  createQuotation,
  getAllQuotation,
  getQuotation,
  updateQuotation,
  deleteQuotation,
  searchQuotationByCustomerName,
} from "../controllers/QuotationController.js";

const router = express.Router();

// POST /Quotation - create a new Quotation
router.post("/new-quotation", createQuotation);

// GET /Quotation - get all Quotations
router.get("/all-quotations", getAllQuotation);

router.get("/search", searchQuotationByCustomerName);

// GET /Quotation/:id - get a specific Quotation by ID
router.get("/:id", getQuotation);

// PUT /Quotation/:id - update an Quotation
router.put("/:id", updateQuotation);

// DELETE /Quotation/:id - delete an Quotation
router.delete("/:id", deleteQuotation);

export default router;
