import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  searchInvoicesByCustomerName,
  sendEmailWithPdf,
} from "../controllers/InvoiceController.js";

import multer from "multer";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// POST /invoice - create a new invoice
router.post("/new-invoice", isAuthenticated, isAdmin, createInvoice);

// GET /invoice - get all invoices
router.get("/all-invoices", getAllInvoices);

router.get("/search", searchInvoicesByCustomerName);

// GET /invoice/:id - get a specific invoice by ID
router.get("/:id", getInvoice);

// PUT /invoice/:id - update an invoice
router.put("/:id", isAuthenticated, isAdmin, updateInvoice);

// DELETE /invoice/:id - delete an invoice
router.delete("/:id", isAuthenticated, isAdmin, deleteInvoice);

router.post(
  "/send-email",
  isAuthenticated,
  isAdmin,
  upload.single("pdf"),
  sendEmailWithPdf
);

export default router;
