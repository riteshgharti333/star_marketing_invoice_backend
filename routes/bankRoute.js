import express from "express";

import {
  createBank,
  deleteBank,
  getAllBanks,
  getBankById,
  searchBank,
  updateBank,
} from "../controllers/BankControler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/new-bank", isAuthenticated, isAdmin, createBank);

router.get("/all-banks", getAllBanks);

router.get("/search", searchBank);

router.get("/:id", getBankById);

router.post("/:id", isAuthenticated, isAdmin, updateBank);

router.delete("/:id", isAuthenticated, isAdmin, deleteBank);

export default router;
