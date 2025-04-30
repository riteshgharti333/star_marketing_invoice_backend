import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  searchCustomersByName,
  updateCustomer,
} from "../controllers/CustomerController.js";

const router = express.Router();

router.post("/new-customer", createCustomer);
router.get("/all-customers", getAllCustomers);

router.get("/search", searchCustomersByName);

router.get("/:id", getCustomer);

router.post("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
