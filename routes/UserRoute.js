import express from "express";
import UserController from "../app/controllers/UserController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";

const routerUser = express.Router();

routerUser.post("/m-update", authMiddleware.authApp, UserController.update);
routerUser.get(
  "/getProfileUserFromId/:id",
  UserController.getProfileUserFromId
);

export default routerUser;
