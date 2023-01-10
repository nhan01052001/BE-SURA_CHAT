import express from "express";
import FriendController from "../app/controllers/FriendController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";

const routerFriend = express.Router();

routerFriend.get("/web", authMiddleware.isAuth, FriendController.getAllFriend);
routerFriend.get("/", authMiddleware.authApp, FriendController.getAllFriend);
routerFriend.post(
  "/m-deleteFriend",
  authMiddleware.authApp,
  FriendController.deleteFriend
);

export default routerFriend;
