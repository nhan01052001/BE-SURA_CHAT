import routerAuth from "./Auth.js";
import routerChat from "./ChatRoute.js";
import routerCloudinary from "./Cloudinary.js";
import routerFriend from "./FriendRoute.js";
import routerMessage from "./MessageRoute.js";
import routerRequestFriend from "./RequestFriendRoute.js";
import routerUser from "./UserRoute.js";
import routerGroupChat from "./GroupChatRouter.js";
import routerFirebase from "./FirebaseRoute.js";

function route(app) {
  // ROUTE sử dụng đường dẫn nào
  app.use("/", routerAuth);
  app.use("/user", routerUser);
  app.use("/messages", routerMessage);
  app.use("/chat", routerChat);
  app.use("/request-friend", routerRequestFriend);
  app.use("/cloudinary", routerCloudinary);
  app.use("/friend", routerFriend);
  app.use("/groupChat", routerGroupChat);
  app.use("/firebase", routerFirebase);
}

export default route;
