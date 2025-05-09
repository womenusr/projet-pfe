import express from "express";
import {
  createWorkPermit,
  getAllWorkPermits,
  getWorkPermitById,
  updateWorkPermit,
  deleteWorkPermit,
} from "../controllers/workPermitController.js";

const router = express.Router();

router.post("/", createWorkPermit);
router.get("/get_all_workpermits", getAllWorkPermits);
router.get("/get_workpermit_by_id/:id", getWorkPermitById);
router.put("/:id", updateWorkPermit);
router.delete("/:id", deleteWorkPermit);

export default router;
