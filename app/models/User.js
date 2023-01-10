import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  introducePersonal: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
  },
  coverImg: {
    type: String,
    default:
      "http://groundandco.com.au/wp-content/plugins/uix-page-builder/includes/uixpbform/images/default-cover-6.jpg",
  },
  friends: [],
  groups: [],
  tokens: [
    {
      token: {
        type: String,
        required: false,
        // required: true,
      },
    },
  ],
  refreshToken: {
    type: String,
    required: false,
  },
  idRequest: {
    type: String,
  },
});

User.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  next();
});

const UserModel = mongoose.model("User", User);
export default UserModel;
