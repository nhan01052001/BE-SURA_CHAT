import mongoose from "mongoose";

const GroupChatSchema = new mongoose.Schema(
  {
    imgGroupChat: {
      type: String,
      required: false,
      default:
        "https://media.istockphoto.com/vectors/people-group-avatar-character-vector-id929634052?k=20&m=929634052&s=170667a&w=0&h=B8im2iJZyUOvY-vsNuJSIY3_sD1cnBrEV0gAyyosP3Y=",
    },

    nameGroupChat: {
      type: String,
      required: true,
    },

    adminGroup: {
      type: String,
      required: true,
    },

    memberChat: [],
  },
  {
    timestamps: true,
  }
);

const GroupChatModel = mongoose.model("GroupChat", GroupChatSchema);
export default GroupChatModel;
