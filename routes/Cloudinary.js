import express from "express";
import CloudinaryController from "../app/controllers/CloudinaryController.js";
import MessageController from "../app/controllers/MessageController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";
import { uploadCloud } from "../config/cloudynary/cloudinary.config.js";
const routerCloudinary = express.Router();

routerCloudinary.get("/images", CloudinaryController.images);
routerCloudinary.post(
  "/m-upload",
  authMiddleware.authApp,
  CloudinaryController.upload,
  MessageController.addMessage
);
export default routerCloudinary;
