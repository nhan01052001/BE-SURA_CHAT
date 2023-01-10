import mongoose, { mongo } from "mongoose";
import ChatModel from "../models/chatModel.js";
import GroupChatModel from "../models/GroupChat.js";
import UserModel from "../models/User.js";

const GroupChatController = {
  createGroupChat: async (req, res, next) => {
    const adminGroup = req.user._id;

    const { nameGroupChat, memberChat } = req.body;

    if (memberChat.length < 3) {
      return res.status(400).send("Nhóm chat phải từ từ 3 thành viên trở lên!");
    }

    const groupChat = new GroupChatModel({
      nameGroupChat: nameGroupChat,
      adminGroup: adminGroup,
      memberChat: memberChat,
      // imgGroupChat: avatar,
    });

    try {
      const rs = await groupChat.save();
      req.body.idGroupChat = rs._id;
      req.body.listIdUser = rs.memberChat;
      req.body.group = rs;
      console.log("req.body.group");
      console.log(memberChat);
      next();
    } catch (error) {
      res.status(406).json(error);
    }
  },

  getGroupChat: async (req, res) => {
    const user = req.user;
    console.log(user);
    const listGroup = [];
    for (const group of user.groups) {
      const id = mongoose.Types.ObjectId(group.id);
      const data = await GroupChatModel.findOne({ _id: id });
      listGroup.push(data);
    }
    res.status(200).json({ listGroup });
  },

  getMemberInGroupChat: async (req, res) => {
    const { idGroupChat } = req.params;
    console.log(idGroupChat);

    const rs = await GroupChatModel.findById({
      _id: mongoose.Types.ObjectId(idGroupChat),
    });

    if (!rs) {
      res.status(400).json({ mess: "Khong co group" });
    } else {
      const listUser = rs.memberChat;
      const listMemberChat = [];

      for (const idUser of listUser) {
        const mb = await UserModel.findById({
          _id: mongoose.Types.ObjectId(idUser.id),
        });
        listMemberChat.push(mb);
      }

      res.status(200).json(listMemberChat);
    }
  },

  getInfoGroup: async (req, res) => {
    const { idGroup } = req.params;
    const id = mongoose.Types.ObjectId(idGroup);

    console.log(idGroup);
    try {
      const group = await GroupChatModel.findOne({ _id: id });
      console.log("group: ");
      console.log(group);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.status(200).json(group);
    } catch (error) {
      res.status(402).json({ message: error });
    }
  },

  updateGroupChatInUser: async (req, res, next) => {
    const listIdUser = req.body.listIdUser;
    const idGroupChat = req.body.idGroupChat;
    const group = req.body.group;

    const oGroups = { id: idGroupChat };
    // const idUser = req.body.idUser;
    for (const idUser of listIdUser) {
      try {
        const rs = await UserModel.findOneAndUpdate(
          { _id: idUser.id },
          { $push: { groups: oGroups } }
        );
      } catch (error) {
        res.status(407).json({ error, message: "Khong thanh cong" });
      }
    }

    // Create chat

    const isGroup = true;
    const idGroup = group._id.toString();

    const members = [idGroup];

    const newChat = new ChatModel({
      members,
      isGroup,
    });
    try {
      const result = await newChat.save();
    } catch (error) {
      res.status(500).json(error);
    }

    res.status(200).json(group);
  },
  deleteUserFromGroupChat: async (req, res, next) => {
    const idGroupChat = req.body._id;
    const idUserDeleted = req.body.idUserDeleted;
    console.log("---------------Delete User Group---------------------");
    console.log("idGroupChat: ");
    console.log(idGroupChat);
    console.log("idUserDeleted: ");
    console.log(idUserDeleted);

    const remove = await GroupChatModel.findByIdAndUpdate(
      idGroupChat,
      {
        $pull: {
          memberChat: { id: idUserDeleted },
        },
      },
      {
        new: true,
      }
    );

    if (!remove) {
      res.status(408).json({ message: "xoa khong thanh cong" });
      throw new Error("Chat Not Found");
    } else {
      req.body.idGroupChat = idGroupChat;
      req.body.idUserDeleted = idUserDeleted;
      next();
      // res.status(200).json({ message: "xoa thanh cong", remove });
    }
  },
  deleteGroupChat: async (req, res) => {
    const user = req.user;
    const meId = user._id;
    const groupId = req.body.groupId;
    const groupChat = await GroupChatModel.findOne({ _id: groupId });
    const _groupId = groupChat._id;
    const groupChatAdminId = groupChat.adminGroup;
    const userDeleteId = req.body.userDeleteId;
    try {
      if (meId == groupChatAdminId) {
        await GroupChatModel.findOneAndUpdate(
          { _id: groupId },
          { $pull: { memberChat: { id: userDeleteId } } }
        );
        await UserModel.findOneAndUpdate(
          { _id: userDeleteId },
          { $pull: { groups: { id: _groupId } } }
        );
        res
          .status(200)
          .send(
            "groupId: " +
              groupId +
              "+" +
              "admin: " +
              groupChatAdminId +
              "+" +
              "id bi xoa: " +
              userDeleteId
          );
      } else {
        res.send("ban khong phai admin");
      }
    } catch (error) {
      console.log("loi");
    }
  },
  franchiesAdmin: async (req, res) => {
    const { groupId, newAdminId } = req.body;
    console.log("groupId", groupId);
    try {
      await GroupChatModel.findOneAndUpdate(
        { _id: groupId },
        { adminGroup: newAdminId }
      );
      res.status(200).send({ message: "Nhượng quyền thành công" });
    } catch (error) {
      res.status(502).send({ error });
    }
  },
  leaveGroup: async (req, res) => {
    const user = req.user;
    const meId = user._id;
    const groupId = req.body.groupId;
    const groupChat = await GroupChatModel.findOne({ _id: groupId });
    const _groupId = groupChat._id;
    const groupChatAdminId = groupChat.adminGroup;
    const newAdminId = req.body.newAdminId;

    console.log("----LEAVE GROUP----------");
    console.log(meId);
    try {
      if (meId == groupChatAdminId) {
        await GroupChatModel.findOneAndUpdate(
          { _id: groupId },
          { $pull: { memberChat: { id: meId.toString() } } }
        );
        await UserModel.findOneAndUpdate(
          { _id: meId },
          { $pull: { groups: { id: mongoose.Types.ObjectId(_groupId) } } }
        );
        await GroupChatModel.findOneAndUpdate(
          { _id: groupId },
          { adminGroup: newAdminId }
        );
        res
          .status(200)
          .send("admin da roi khoi nhom va admin moi la: " + "newAdminId");
      }
      if (meId != groupChatAdminId) {
        await GroupChatModel.findOneAndUpdate(
          { _id: groupId },
          { $pull: { memberChat: { id: meId.toString() } } }
        );
        await UserModel.findOneAndUpdate(
          { _id: meId },
          { $pull: { groups: { id: _groupId } } }
        );
        res.status(201).send("roi thanh cong");
      }
    } catch (error) {
      console.log("loi");
    }
  },

  renameGroupChat: async (req, res) => {
    const idGroupChat = req.body._id;
    // const adminGroup = req.body.adminGroup;
    // const idOfUserRename = req.body.idOfUserRename;
    const newNameGroupChat = req.body.newNameGroupChat;

    // if (adminGroup !== idOfUserRename) {
    //   return res.status(408).json({ message: "Ban khong co quyen doi ten!" });
    // } else {
    const update = await GroupChatModel.findByIdAndUpdate(
      idGroupChat,
      {
        nameGroupChat: newNameGroupChat,
      },
      {
        new: true,
      }
    );

    if (!update) {
      res.status(408).json({ message: "cap nhat khong thanh cong" });
      throw new Error("Chat Not Found");
    } else {
      res.status(200).json({ message: "cap nhat thanh cong", update });
    }
    // }
  },

  updateUserWhenDelete: async (req, res) => {
    const idGroupChat = req.body.idGroupChat;
    const idUserDeleted = req.body.idUserDeleted;

    const removeGroup = await UserModel.findByIdAndUpdate(
      idUserDeleted,
      {
        $pull: {
          groups: { id: mongoose.Types.ObjectId(idGroupChat) },
        },
      },
      {
        new: true,
      }
    );

    if (!removeGroup) {
      res.status(409).json({ message: "khong thanh cong" });
      throw new Error("Chat Not Found");
    } else {
      res.status(200).json({ message: "thanh cong", removeGroup });
    }
  },

  addUserToGroup: async (req, res, next) => {
    const idGroupChat = req.body.idGroupChat;
    const idUser = req.body.idUser;

    const added = await GroupChatModel.findByIdAndUpdate(
      idGroupChat,
      {
        $push: {
          memberChat: { id: idUser },
        },
      },
      {
        new: true,
      }
    );

    if (!added) {
      res.status(409).json({ message: "khong thanh cong" });
      throw new Error("Chat Not Found");
    } else {
      req.body.idGroupChat = idGroupChat;
      req.body.idUser = idUser;
      next();
      // res.status(200).json({ message: "them thanh cong", added });
    }
  },
  addUsersToGroup: async (req, res, next) => {
    const { idGroupChat, listIdUser } = req.body;
    console.log("ADD User To Group");
    console.log("idGroupChat:");
    console.log(idGroupChat);
    console.log("listIdUser:");
    console.log(listIdUser);
    if (!listIdUser || !idGroupChat) {
      res.status(404).json({ message: "Khong tim thay list id hay id group" });
      return;
    }
    for (const id of listIdUser) {
      try {
        const added = await GroupChatModel.findByIdAndUpdate(
          { _id: idGroupChat },
          {
            $push: {
              memberChat: { id: id.id },
            },
          },
          {
            new: true,
          }
        );
      } catch (error) {
        res.status(401).send({ message: error });
      }
    }
    req.body.idGroupChat = idGroupChat;
    req.body.listIdUser = listIdUser;
    next();
  },
  updateGroupInUsers: async (req, res) => {
    const { listIdUser, idGroupChat } = req.body;

    for (const id of listIdUser) {
      try {
        const insert = await UserModel.findByIdAndUpdate(
          { _id: id.id },
          {
            $push: {
              groups: { id: mongoose.Types.ObjectId(idGroupChat) },
            },
          },
          {
            new: true,
          }
        );
      } catch (error) {
        res.status(401).send({ message: error });
      }
    }
    res.status(200).json({ message: "them vao nhom chat thanh cong" });
  },

  updateGroupInUser: async (req, res) => {
    const idGroupChatInsert = req.body.idGroupChat;
    const idUserNeedInsert = req.body.idUser;

    const insert = await UserModel.findByIdAndUpdate(
      idUserNeedInsert,
      {
        $push: {
          groups: { id: mongoose.Types.ObjectId(idGroupChatInsert) },
        },
      },
      {
        new: true,
      }
    );

    if (!insert) {
      res.status(409).json({ message: "them vao nhom chatkhong thanh cong" });
      throw new Error("Chat Not Found");
    } else {
      res
        .status(200)
        .json({ message: "them vao nhom chat thanh cong", insert });
    }
  },
  deleteGroup: async (req, res) => {
    console.log(
      "---------------------------Delete Group------------------------"
    );
    const idGroup = req.body.groupId;
    try {
      const group = await GroupChatModel.findOne({ _id: idGroup });
      const memberChat = group.memberChat;
      for (const member of memberChat) {
        console.log("member:");
        console.log(member);

        const data = await UserModel.findOneAndUpdate(
          { _id: member.id },
          { $pull: { groups: { id: mongoose.Types.ObjectId(idGroup) } } }
        );
        console.log("DATA:");
        console.log(data);
      }
      await GroupChatModel.deleteOne({ _id: idGroup });
    } catch (error) {
      res.status(502).json({ message: "Xóa thất bại" });
    }
    res.status(204).json({ message: "Xóa thành công" });
  },

  // getInforGroup: async (req, res) => {
  //   console.log(req.params);
  // }
};

export default GroupChatController;
