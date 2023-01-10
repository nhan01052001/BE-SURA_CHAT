import MessageModel from "../models/messageModel.js";

const FirebaseController = {
  uploadImageToFirebase: async (req, res, next) => {
    try {
      const type = req.body.type;
      req.body.senderId = req.user.id;
      req.body.text = req.body.text;
      if (type == "png" || type == "jpg" || type == "jpeg") {
        req.body.isImg = true;
      }
      req.body.chatId = req.body.chatId;
      req.body.type = req.body.type;
      req.body.fileName = req.body.fileName;

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  },
};

export default FirebaseController;
