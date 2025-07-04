import express from "express";

import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  searchCustomersByName,
  updateCustomer,
} from "../controllers/CustomerController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/new-customer", isAuthenticated, isAdmin, createCustomer);

router.get("/all-customers", getAllCustomers);

router.get("/search", searchCustomersByName);

router.get("/:id", getCustomer);

router.post("/:id", isAuthenticated, isAdmin, updateCustomer);
router.delete("/:id", isAuthenticated, isAdmin, deleteCustomer);

export default router;
