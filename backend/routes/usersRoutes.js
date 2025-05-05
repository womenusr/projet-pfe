import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js"; // تأكد من تعديل المسار حسب مكان ملفاتك

const router = express.Router();


router.post("/add_user", createUser);


router.get("/get_all_users", getAllUsers);


router.get("/get_user_by_id/:id", getUserById);


router.put("/update_user/:id", updateUser);


router.delete("/delete_user/:id", deleteUser);

export default router;
