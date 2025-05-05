import express from "express";
import {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";

const router = express.Router();

router.post("/create_stock", createStock);

router.get("/get_all_stocks", getAllStocks);

router.get("/get_stock/:id", getStockById);

router.put("/update_stock/:id", updateStock);

router.delete("/delete_stock/:id", deleteStock);

export default router;
