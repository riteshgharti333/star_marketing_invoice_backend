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

router.post("/new-signature",  imageHandler.upload.single("signatureImage"),
imageHandler.processImage, createSignature);

router.get("/all-signatures", getAllSignatures);

router.get("/:id", getSignatureById);

router.put("/:id", updateSignature);

router.delete("/:id", deleteSignature);

export default router;
