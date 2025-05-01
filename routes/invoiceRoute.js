import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  searchInvoicesByCustomerName,
} from "../controllers/InvoiceController.js";

const router = express.Router();

// POST /invoice - create a new invoice
router.post("/new-invoice", createInvoice);

// GET /invoice - get all invoices
router.get("/all-invoices", getAllInvoices);

router.get("/search", searchInvoicesByCustomerName);


// GET /invoice/:id - get a specific invoice by ID
router.get("/:id", getInvoice);

// PUT /invoice/:id - update an invoice
router.put("/:id", updateInvoice);

// DELETE /invoice/:id - delete an invoice
router.delete("/:id", deleteInvoice);




export default router;
