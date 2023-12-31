import { Router } from "express";
import authController from "./userController";

const authRouter = Router();

authRouter.post("/signUp", authController.signUpUser);

authRouter.post("/login", authController.login);

export default authRouter;