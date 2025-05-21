import express from "express";
import {
  createPatrol,
  deletePatrol,
  getAllPatrols,
  getPatrolById,
  updatePatrol,
  updatePatrolStatus,
} from "../controllers/patrolController.js";
const router = express.Router();

import upload from "../middlewares/multer.js";

// CRUD Routes
router.get("/", getAllPatrols);
router.get("/:id", getPatrolById);
router.post(
  "/",
  upload.fields([
    { name: "photosBefore", maxCount: 10 },
    { name: "photosAfter", maxCount: 10 },
  ]),
  createPatrol
);
router.put(
  "/:id",
  upload.fields([
    { name: "photosBefore", maxCount: 10 },
    { name: "photosAfter", maxCount: 10 },
  ]),
  updatePatrol
);
router.delete("/:id", deletePatrol);

router.put("/update_patrol_status/:id", updatePatrolStatus);

export default router;
