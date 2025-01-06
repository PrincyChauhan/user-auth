import express from "express";
import { userSignup, userLogin } from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.post("/signup", userSignup);
UserRouter.post("/signin", userLogin);

export default UserRouter;
