import stockModel from "../models/stockModel.js"

export const createStock = async (req, res) => {
  try {
    const { product_name, quantity } = req.body;
    const newStock = new stockModel({ product_name, quantity });
    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await stockModel.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStockById = async (req, res) => {
  try {
    const stock = await stockModel.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const updatedStock = await stockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStock)
      return res.status(404).json({ message: "Stock not found" });
    res.status(200).json(updatedStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await stockModel.findByIdAndDelete(req.params.id);
    if (!deletedStock)
      return res.status(404).json({ message: "Stock not found" });
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
