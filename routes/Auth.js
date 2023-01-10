import express from "express";
import AutherController from "../app/controllers/AuthController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";

const routerAuth = express.Router();
routerAuth.get(
  "/getAllUser",
  authMiddleware.authApp,
  AutherController.getAllUser
);
routerAuth.post("/login", AutherController.login);
routerAuth.post("/register", AutherController.register);
routerAuth.post("/app/register", AutherController.registerApp);
routerAuth.post("/register/info", AutherController.registerInfomation);
routerAuth.post("/register/verify", AutherController.verifyUsername);
routerAuth.post("/refresh", AutherController.refreshToken);
routerAuth.post("/forgot/verify", AutherController.existUsername);
routerAuth.post("/forgot/reset-password", AutherController.resetPassword);
routerAuth.post("/change-password", AutherController.changePassword);
routerAuth.get("/profile", authMiddleware.isAuth, AutherController.profile);
routerAuth.get("/me", authMiddleware.authApp, AutherController.me);
export default routerAuth;
