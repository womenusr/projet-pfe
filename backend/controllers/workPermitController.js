import hotWorkModel from "../models/hotWorkModel.js";
import WorkPermit from "../models/workPermitModel.js";

export const createWorkPermit = async (req, res) => {
  try {
    const exisitingWorkPermits = await WorkPermit.find();
    if (req.body.hotWork) {
      let newHotWork = new hotWorkModel(req.body.hotWork);
      await newHotWork.save();
      const permit = new WorkPermit({
        ...req.body,
        numero: exisitingWorkPermits.length + 1,
        hot_work_id: newHotWork._id,
      });
      await permit.save();
      res.status(201).json(permit);
    } else {
      const permit = new WorkPermit({
        ...req.body,
        numero: exisitingWorkPermits.length + 1,
      });
      await permit.save();
      res.status(201).json(permit);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllWorkPermits = async (req, res) => {
  try {
    const permits = await WorkPermit.find().populate("hot_work_id");
    res.json(permits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkPermitById = async (req, res) => {
  try {
    const permit = await WorkPermit.findById(req.params.id).populate(
      "hot_work_id"
    );
    if (!permit) return res.status(404).json({ message: "Not found" });
    res.json(permit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWorkPermit = async (req, res) => {
  const { hotWork, ...data } = req.body;

  try {
    if (hotWork) {
      if (hotWork._id) {
        // Update existing HotWork
        const updatedHotWork = await hotWorkModel.findByIdAndUpdate(
          hotWork._id,
          hotWork,
          { new: true }
        );

        if (!updatedHotWork) {
          return res.status(404).json({ message: "HotWork not found" });
        }
      } else {
        // Create new HotWork and link to WorkPermit
        const newHotWork = new hotWorkModel(hotWork);
        await newHotWork.save();
        data.hot_work_id = newHotWork._id;
      }
    }

    const updatedWorkPermit = await WorkPermit.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updatedWorkPermit) {
      return res.status(404).json({ message: "WorkPermit not found" });
    }

    res.json(updatedWorkPermit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWorkPermit = async (req, res) => {
  try {
    const deleted = await WorkPermit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
