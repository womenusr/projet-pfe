import HotWorkPermit from "../models/hotWorkModel.js"

// Create
export const createPermit = async (req, res) => {
  try {
    const newPermit = new HotWorkPermit(req.body);
    const savedPermit = await newPermit.save();
    res.status(201).json(savedPermit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read All
export const getAllPermits = async (req, res) => {
  try {
    const permits = await HotWorkPermit.find();
    res.json(permits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One
export const getPermitById = async (req, res) => {
  try {
    const permit = await HotWorkPermit.findById(req.params.id);
    if (!permit) return res.status(404).json({ error: "Permit not found" });
    res.json(permit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updatePermit = async (req, res) => {
  try {
    const updated = await HotWorkPermit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deletePermit = async (req, res) => {
  try {
    await HotWorkPermit.findByIdAndDelete(req.params.id);
    res.json({ message: "Permit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
