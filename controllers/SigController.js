import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Signature } from "../models/sigModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import streamifier from "streamifier";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";

// CREATE SIGNATURE
export const createSignature = catchAsyncError(async (req, res, next) => {
  const { signatureName } = req.body;

  if (!signatureName) {
    throw new ErrorHandler("Signature name is required", 400);
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sm_invoice/sig_images",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    imageUrl = result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new ErrorHandler("Failed to upload image to Cloudinary", 500);
  }

  const signature = await Signature.create({
    signatureName,
    signatureImage: imageUrl,
  });

  res.status(201).json({
    result: 1,
    message: "Signature created successfully",
    signature,
  });
});

// GET ALL SIGNATURES
export const getAllSignatures = catchAsyncError(async (req, res, next) => {
  const signatures = await Signature.find();

  res.status(200).json({
    result: 1,
    message: "Signatures fetched successfully",
    signatures,
  });
});

// GET SIGNATURE BY ID
export const getSignatureById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const signature = await Signature.findById(id);

  if (!signature) {
    throw new ErrorHandler("Signature not found", 404);
  }

  res.status(200).json({
    result: 1,
    message: "Signature fetched successfully",
    signature,
  });
});

// UPDATE SIGNATURE
export const updateSignature = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  // Check if the signature exists
  let signature = await Signature.findById(id);

  if (!signature) {
    throw new ErrorHandler("Signature not found", 404);
  }

  // If a new image is uploaded, update the image path
  if (req.file) {
    signature.signatureImage = `/uploads/${req.file.filename}`;
  }

  // Update the signature's name if provided
  if (name) {
    signature.name = name;
  }

  signature = await signature.save();

  res.status(200).json({
    result: 1,
    message: "Signature updated successfully",
    signature,
  });
});

// DELETE SIGNATURE
export const deleteSignature = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const signature = await Signature.findByIdAndDelete(id);

  if (!signature) {
    throw new ErrorHandler("Signature not found", 404);
  }

  res.status(200).json({
    result: 1,
    message: "Signature deleted successfully",
  });
});
