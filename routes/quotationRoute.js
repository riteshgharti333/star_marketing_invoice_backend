import express from "express";
import {
  createQuotation,
  getAllQuotation,
  getQuotation,
  updateQuotation,
  deleteQuotation,
  searchQuotationByCustomerName,
} from "../controllers/QuotationController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// POST /Quotation - create a new Quotation
router.post("/new-quotation", isAuthenticated, isAdmin, createQuotation);

// GET /Quotation - get all Quotations
router.get("/all-quotations", getAllQuotation);

router.get("/search", searchQuotationByCustomerName);

// GET /Quotation/:id - get a specific Quotation by ID
router.get("/:id", getQuotation);

// PUT /Quotation/:id - update an Quotation
router.put("/:id", isAuthenticated, isAdmin, updateQuotation);

// DELETE /Quotation/:id - delete an Quotation
router.delete("/:id", isAuthenticated, isAdmin, deleteQuotation);

export default router;
