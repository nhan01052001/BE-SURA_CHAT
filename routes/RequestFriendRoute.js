import express from "express";
import FriendController from "../app/controllers/FriendController.js";
import RequestFriendController from "../app/controllers/RequestFriendController.js";
import UserController from "../app/controllers/UserController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";
const routerRequestFriend = express.Router();
// /request-friend-app
routerRequestFriend.get(
  "/listRequest",
  authMiddleware.authApp,
  RequestFriendController.getListRequest,
  UserController.getListUserFromId
);
routerRequestFriend.post(
  "/m-check/:receiverId",
  authMiddleware.authApp,
  RequestFriendController.checkRequestFriend,
  RequestFriendController.revokeRequestFriendHandle
);
// tu choi loi moi ket ban cach khac
routerRequestFriend.post(
  "/declineFriend_diff/:senderId",
  authMiddleware.authApp,
  RequestFriendController.checkRequestFriend_2,
  RequestFriendController.declineFriend_diff
);
// chap nhan loi moi ket ban cach khac
routerRequestFriend.post(
  "/acceptFriend_diff/:senderId",
  authMiddleware.authApp,
  RequestFriendController.checkRequestFriend_2,
  RequestFriendController.acceptFriend_diff
);
// get all request sent by id of sender
routerRequestFriend.get(
  "/getAllRequestSentWithSenderId",
  authMiddleware.authApp,
  RequestFriendController.getAllRequestSentWithSenderId,
  UserController.getListUserFromId
);
// new
routerRequestFriend.get(
  "/getIdRequest/:id",
  RequestFriendController.getIdRequest
);
routerRequestFriend.get(
  "/getRequestFromIdRequest/:idRequest",
  RequestFriendController.getRequestFromIdRequest
);
routerRequestFriend.post("/accept", RequestFriendController.acceptFriend);
routerRequestFriend.post("/decline", RequestFriendController.declineFriend);
routerRequestFriend.post("/send", RequestFriendController.sendRequestFriend);

export default routerRequestFriend;
