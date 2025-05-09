import mongoose from "mongoose";
import hotWorkModel from "./hotWorkModel.js";

const PersonSchema = new mongoose.Schema({
  name: String,
  position: String,
  cin: String,
  signature: String,
});

const briefingSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["done", "blocked", "reluctantly"],
  },
  description: {
    type: String,
  },
});

const WorkPermitSchema = new mongoose.Schema(
  {
    numero: Number,
    intervention: String,
    coordinatorName: String,
    coordinatorPosition: String,
    speakerName: String,
    speakerPosition: String,
    speakerCIN: String,
    speakerSignature: String,
    accompanyingNumber: String,
    persons: [PersonSchema],
    startDateTime: Date,
    endDateTime: Date,
    placeArea: String,
    natureOfWorks: String,
    toolsUsed: [String],
    otherTool: String,
    otherRequirements: String,
    engineerManager: String,
    hseOfficer: String,
    guardJob: String,
    inspectionDate: Date,
    inspectionPlace: String,
    coordinatorSignature: String,
    responsibleSignature: String,
    status: {
      type: String,
      default: "pending",
      enum: ["approved", "rejected", "pending"],
    },
    briefing: {
      type: briefingSchema,
    },
    hot_work_id: {
      type: mongoose.Types.ObjectId,
      ref: hotWorkModel,
    },
  },
  { timestamps: true }
);

const WorkPermit = mongoose.model("WorkPermit", WorkPermitSchema);
export default WorkPermit;

/*


*/
