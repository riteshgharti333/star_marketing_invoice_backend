import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {
  createBank,
  deleteBank,
  getAllBanks,
  getBankById,
  searchBank,
  updateBank,
} from "../controllers/BankControler.js";

const router = express.Router();

router.post("/new-bank", createBank);

router.get("/all-banks", getAllBanks);

router.get("/search", searchBank);

router.get("/:id", getBankById);

router.post("/:id", updateBank);

router.delete("/:id", deleteBank);

export default router;
