import express from "express";
import {
  createPermit,
  getAllPermits,
  getPermitById,
  updatePermit,
  deletePermit,
} from "../controllers/hotWorkPermitController.js";

const router = express.Router();

router.post("/create_permit", createPermit);
router.get("/get_all_permits", getAllPermits);
router.get("/get_permit_by_id/:id", getPermitById);
router.put("/update_permit/:id", updatePermit);
router.delete("/delete_permit/:id", deletePermit);

export default router;
