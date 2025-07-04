import express from "express";

import {
  createproduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  searchProductsByName,
  updateProduct,
} from "../controllers/ProductController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/new-product", isAuthenticated, isAdmin, createproduct);
router.get("/all-products", getAllProducts);

router.get("/search", searchProductsByName);

router.get("/:id", getProduct);

router.post("/:id", isAuthenticated, isAdmin, updateProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
