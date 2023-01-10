import RequestFriendModel from "../models/requestFriend.js";
import UserModel from "../models/User.js";
import mongoose from "mongoose";
const RequestFriendController = {
  getListRequest: async (req, res, next) => {
    console.log("Get List Requets: ");

    const id = req.user._id;
    console.log("id nguoi nhan: " + id);
    const listRequest = await RequestFriendModel.find({
      receiverId: mongoose.Types.ObjectId(id),
    });
    // List request

    // Chuyển đổi list requets thành user
    // Mảng chứa list id người gửi
    const listReceiverId = [];
    listRequest.forEach((request) => {
      console.log("request: " + request._id);
      console.log(request);
      listReceiverId.push({
        id: request.senderId,
        idRequest: request._id.toString(),
      });
    });
    console.log("Array List Requets: ");

    console.log(listReceiverId);
    req.listIdUser = listReceiverId;

    next();
    // Gửi chuyển cho userController response cho client
  },

  getRequestFromIdRequest: async (req, res) => {
    const idRequest = req.params.idRequest;
    const rs = await RequestFriendModel.find({
      _id: mongoose.Types.ObjectId(idRequest),
    });

    if (!rs) {
      res.status(400).json({ message: "Null" });
    } else {
      res.status(200).json(rs);
    }
  },

  // get all request sent by id of sender
  getAllRequestSentWithSenderId: async (req, res, next) => {
    console.log("Get List Requets: ");

    const id = req.user._id;
    const list = await RequestFriendModel.find({
      senderId: mongoose.Types.ObjectId(id),
    });

    // this array save id of receiver then switch it to router diff to handle (UserController.getListUserFromId)
    const listTemp = [];
    list.forEach((ls) => {
      listTemp.push({
        id: ls.receiverId,
      });
    });

    req.listIdUser = listTemp;

    next();
  },

  getIdRequest: async (req, res) => {
    const id = req.params.id;
    const idRequest = await RequestFriendModel.find({
      receiverId: mongoose.Types.ObjectId(id),
    });

    if (!idRequest) {
      res.status(500).json("null");
    } else {
      res.status(200).json(idRequest);
    }
  },
  acceptFriend: async (req, res) => {
    const idRequest = req.body.idRequest;
    const listId = await RequestFriendModel.findOne({ _id: idRequest });
    const senderId = listId.senderId;
    const receiverId = listId.receiverId;
    res.send(senderId + "+" + receiverId);
    try {
      const Result1 = await UserModel.findOneAndUpdate(
        { _id: senderId },
        { $push: { friends: { id: receiverId } } }
      );
      const Result2 = await UserModel.findOneAndUpdate(
        { _id: receiverId },
        { $push: { friends: { id: senderId } } }
      );
      await RequestFriendModel.deleteOne({ _id: idRequest });
    } catch (error) {
      console.log("loi");
    }
  },
  //tu choi ne
  declineFriend: async (req, res) => {
    console.log("---------------declineFriend------------------");
    const idRequest = req.body.idRequest;
    console.log("idRequest: ");
    console.log(idRequest);
    try {
      const data = await RequestFriendModel.deleteOne({ _id: idRequest });
      res.status(200).send(data);
    } catch (error) {
      res.status(402).send(error);
    }
  },
  sendRequestFriend: async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    console.log("Send Request Friend: ");
    console.log(senderId);
    console.log(receiverId);

    const request = new RequestFriendModel({ senderId, receiverId });
    try {
      const data = await request.save();

      console.log(data);
      res.status(200).send({ idRequest: data._id });
    } catch (err) {
      res.status(500).send(err);
    }
    console.log("End send");
  },
  checkRequestFriend: async (req, res, next) => {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;
    try {
      const data = await RequestFriendModel.findOne({ senderId, receiverId });
      console.log(data);
      req.idRequest = data._id;
      next();
    } catch (error) {
      res.status(402).send(error);
    }
  },
  checkRequestFriend_2: async (req, res, next) => {
    const senderId = req.params.senderId;
    const receiverId = req.user._id;
    try {
      const data = await RequestFriendModel.findOne({ senderId, receiverId });
      console.log(data);
      req.idRequest = data._id;
      next();
    } catch (error) {
      res.status(402).send(error);
    }
  },
  declineFriend_diff: async (req, res) => {
    const idRequest = req.idRequest;
    console.log(idRequest);

    const revoke = await RequestFriendModel.deleteOne({ _id: idRequest });
    if (revoke) {
      res.status(204).json({ message: "Khong chap nhan loi moi ket ban" });
    } else {
      res.status(400).json({ message: "Co loi roi" });
    }
  },
  acceptFriend_diff: async (req, res) => {
    const idRequest = req.idRequest;
    const listId = await RequestFriendModel.findOne({ _id: idRequest });
    const senderId = listId.senderId;
    const receiverId = listId.receiverId;
    res.send(senderId + "+" + receiverId);
    try {
      const Result1 = await UserModel.findOneAndUpdate(
        { _id: senderId },
        { $push: { friends: { id: receiverId } } }
      );
      const Result2 = await UserModel.findOneAndUpdate(
        { _id: receiverId },
        { $push: { friends: { id: senderId } } }
      );
      await RequestFriendModel.deleteOne({ _id: idRequest });
    } catch (error) {
      console.log("loi");
    }
  },
  revokeRequestFriendHandle: async (req, res) => {
    const idRequest = req.idRequest;
    console.log(idRequest);

    const revoke = await RequestFriendModel.deleteOne({ _id: idRequest });
    if (revoke) {
      res.status(204).send("Thu hoi thanh cong!");
    } else {
      res.status(400).send("Khong the thu hoi!");
    }
  },
};

export default RequestFriendController;
