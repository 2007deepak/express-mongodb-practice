import express from "express";
import {
  registerUser,
  verifyUser,
  login,
  Profile,
  logoutUser,
  forgotPassword,
} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";



const router = express.Router();

router.post("/register",registerUser);
router.get("/verify:token", verifyUser);
router.post("/login", login);
router.get("/profile", isLoggedIn, Profile);
router.post("/logout", isLoggedIn, logoutUser);
router.post("/forgotPassword", isLoggedIn, forgotPassword);


export default router;
