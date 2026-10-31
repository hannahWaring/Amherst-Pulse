import { Router } from "express";
import {
  login,
  logout,
  refresh,
  signup,
} from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh", refresh);
