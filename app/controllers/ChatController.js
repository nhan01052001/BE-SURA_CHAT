import ChatModel from "../models/chatModel.js";

const ChatController = {
  // POST
  createChat: async (req, res) => {
    if (!req.body.senderId || !req.body.receiverId) {
      return;
    }
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // GET /chat
  userChats: async (req, res) => {
    try {
      const chat = await ChatModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findChat: async (req, res) => {
    console.log(req.params);
    try {
      const chat = await ChatModel.findOne({
        members: { $all: [req.params.senderId, req.params.recieverId] },
      });
      if (chat) {
        console.log(chat);
        res.status(200).json(chat);
      } else {
        console.log("chua tao");
        // res.status(402).send("chua tao");
        res.status(402).json(chat);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default ChatController;
