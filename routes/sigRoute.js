import express from "express";

import {
  createSignature,
  getAllSignatures,
  getSignatureById,
  updateSignature,
  deleteSignature,
} from "../controllers/SigController.js";

const router = express.Router();

import imageHandler from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

router.post(
  "/new-signature",
  isAuthenticated,
  isAdmin,
  imageHandler.upload.single("signatureImage"),
  imageHandler.processImage,
  createSignature
);

router.get("/all-signatures", getAllSignatures);

router.get("/:id", getSignatureById);

router.put("/:id", isAuthenticated, isAdmin, updateSignature);

router.delete("/:id", isAuthenticated, isAdmin, deleteSignature);

export default router;
