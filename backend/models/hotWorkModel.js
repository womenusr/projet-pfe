import mongoose from "mongoose";

const HotWorkPermitSchema = new mongoose.Schema(
  {
    name: String,
    jobDetails: String,
    tools: String,
    location: String,
    interaction: String,
    approvalBy: String,
    approvalDate: String,
    approvalTime: String,
    hours: String,
    shiftDay: String,
    questions: [String],
  },
  { timestamps: true }
);

export default mongoose.model("HotWorkPermit", HotWorkPermitSchema);
