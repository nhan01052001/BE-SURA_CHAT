const socket = (io) => {
  let activeUsers = [];
  let scId = "";
  io.on("connection", (socket) => {
    // add new User
    socket.on("new-user-add", (newUserId) => {
      // if user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        scId = socket.id;
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      // send all active users to new user
      io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
      // remove user from active users
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      // send all active users to all users
      io.emit("get-users", activeUsers);
    });

    // // send message to a specific user
    // socket.on("send-message", (data) => {
    //   console.log(data);
    //   const { receiverId } = data;
    //   if (Array.isArray(receiverId)) {
    //     receiverId.forEach((userReceiver) => {
    //       const user = activeUsers.find(
    //         (user) => user.userId === userReceiver.id
    //       );
    //       console.log("-----------Socket send mesage-------------------");
    //       console.log(user);
    //       if (user) {
    //         // gửi cho các users ngoại trừ sender
    //         //io.to(user.socketId).emit("recieve-message", data);
    //         io.emit("recieve-message", data);
    //       }
    //     });
    //   } else {
    //     const user = activeUsers.find((user) => user.userId === receiverId);
    //     console.log("Sending from socket to :", receiverId);
    //     console.log("Data: ", data);
    //     console.log(user);
    //     if (user) {
    //       // gửi cho các users ngoại trừ sender
    //       // io.to(user.socketId).emit("recieve-message", data);
    //       io.emit("recieve-message", data);
    //     }
    //   }
    // });
    socket.on("send-message", (data) => {
      console.log("-----------Socket send mesage-------------------");
      console.log(data);
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      console.log("Sending from socket to :", receiverId);
      console.log("Data: ", data);
      console.log("-------");
      console.log(activeUsers);
      console.log(user);
      console.log("-------");
      // if (user) {
      //   // gửi cho các users ngoại trừ sender
      //   // io.to(user.socketId).emit("recieve-message", data);
      //   io.emit("recieve-message", data);
      // }
      io.emit("recieve-message", data);
      // io.broadcast.emit("recieve-message", data);
      // io.to(`${user.socketId}`).emit("recieve-message", data);
      // socket.broadcast.emit("recieve-message", data);
    });

    // Socket gửi thông báo tạo vào nhóm cho các user
    // INPUT: Array id người nhận, dữ liệu của group
    //
    socket.on("send-notication-group", (data) => {
      console.log(
        "--------------------send-notication-group------------------------------"
      );
      console.log("Data: ");
      console.log(data);

      const { listIdUser, group } = data;

      listIdUser.forEach((idUser) => {
        const user = activeUsers.find((user) => user.userId === idUser.id);
        console.log("Sending from socket to :", idUser.id);
        if (user) {
          io.to(user.socketId).emit("receive-notication-group", group);
        }
      });

      console.log(
        "--------------------End---send-notication-group------------------------------"
      );
    });
    //
    socket.on("send-require-friend", (data) => {
      console.log(
        "--------------------send-require-friend------------------------------"
      );
      console.log(data.isDeclined);

      const user = activeUsers.find(
        (user) => user.userId === data.userFind._id
      );
      console.log("Sending from socket to :", data.userFind._id);
      console.log("Data: ", data.userFind);
      if (user) {
        if (data.isDeclined) {
          io.to(user.socketId).emit("declined-require-friend", data.user);
          // io.emit("recieve-require-friend", data.user);
        } else if (data.isAccept) {
          // io.emit("recieve-require-friend", { user: data.user });
          io.to(user.socketId).emit("accept-require-friend", {
            user: data.user,
          });
        } else {
          // gửi cho các users ngoại trừ sender
          io.to(user.socketId).emit("recieve-require-friend", data.user);
          // io.emit("recieve-require-friend", data.user);
        }
      }
      console.log(
        "--------------------End---send-require-friend------------------------------"
      );
    });

    // Socket xóa thành viên ra khỏi nhóm
    // INPUT: Array người nhận, id người xóa
    //
    //
    socket.on("delete-member-group", (data) => {
      console.log(
        "--------------------delete-member-group------------------------------"
      );
      console.log("Data: ");
      console.log(data);

      const { listMember, idUserDelete, idHost, idGroupDelete } = data;

      const listNewMember = listMember.filter(
        (member) => member._id !== idUserDelete
      );
      listMember.forEach((member) => {
        const user = activeUsers.find((user) => user.userId === member._id);
        console.log("Sending from socket to :", member._id);
        console.log(user);
        // Không gửi cho người xóa
        if (user) {
          if (user.userId === idHost) {
            return;
          }
          // Gửi id để xóa thành viên khỏi nhóm
          if (user.userId === idUserDelete) {
            console.log("idUserDelete: ", idGroupDelete);
            io.to(user.socketId).emit(
              "receive-delete-member-from-group",
              idGroupDelete
            );
          }
          // Gửi list để render lại
          else {
            console.log("listNewMember");
            console.log(listNewMember);
            io.to(user.socketId).emit("receive-delete-member", listNewMember);
          }
        }
      });

      console.log(
        "--------------------End---send-notication-group------------------------------"
      );
    });
    //
  });
};

export default socket;
