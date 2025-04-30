import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {
  createproduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  searchProductsByName,
  updateProduct,
} from "../controllers/ProductController.js";

const router = express.Router();

router.post("/new-product", createproduct);
router.get("/all-products", getAllProducts);

router.get("/search", searchProductsByName);

router.get("/:id", getProduct);

router.post("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
