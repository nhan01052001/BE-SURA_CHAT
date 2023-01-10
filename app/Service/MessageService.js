import Conversation from "../models/Conversation.js";
const MessageService = {
  async addText(message, userId) {
    const { conversationId } = message;

    const newMessage = new Message({
      userId,
      ...message,
    });

    const saveMessage = await newMessage.save();

    return this.updateWhenHasNewMessage(saveMessage, conversationId, userId);
  },
  

  async updateWhenHasNewMessage(saveMessage, conversationId, userId) {
    const { _id } = saveMessage;

    await Conversation.updateOne(
      { _id: conversationId },
      { lastMessageId: _id }
    );

    const { type } = await Conversation.findById(conversationId);

    return await this.getById(_id, type);
  },
};
