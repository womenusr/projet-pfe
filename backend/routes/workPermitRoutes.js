import express from "express";
import {
  createWorkPermit,
  getAllWorkPermits,
  getWorkPermitById,
  updateWorkPermit,
  deleteWorkPermit,
  sendEmailWithAttachement,
} from "../controllers/workPermitController.js";

const router = express.Router();
import upload from "../middlewares/multer.js";
router.post("/", createWorkPermit);
router.get("/get_all_workpermits", getAllWorkPermits);
router.get("/get_workpermit_by_id/:id", getWorkPermitById);
router.put("/:id", updateWorkPermit);
router.delete("/:id", deleteWorkPermit);
router.post("/send-email", upload.single("file"), sendEmailWithAttachement);

export default router;
