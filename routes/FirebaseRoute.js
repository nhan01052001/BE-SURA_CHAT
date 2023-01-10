import express from "express";
import MessageController from "../app/controllers/MessageController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";
import FirebaseController from "../app/controllers/FIrebaseController.js";

const routerFirebase = express.Router();

routerFirebase.post(
  "/m-firebaseUploadMessageImage",
  authMiddleware.authApp,
  FirebaseController.uploadImageToFirebase,
  MessageController.addMessage
);

export default routerFirebase;
