import express from "express";

import {
  login,
  register,
  updateProfile,
} from "../controllers/authController.js";
import upload from "../middlewares/multer.js";

let authRouter = express.Router();

authRouter.post("/register", upload.single("image"), register);

authRouter.post("/login", login);

authRouter.put("/update_user/:id", upload.single("image"), updateProfile);

export default authRouter;
