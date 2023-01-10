import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const FriendRequestSchema = new mongoose.Schema(
  {
    senderId: ObjectId,
    receiverId: ObjectId,
  },
  {
    timestamps: true,
  }
);

const FriendRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);
export default FriendRequestModel;
