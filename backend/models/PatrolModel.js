import mongoose from "mongoose";
const Schema = mongoose.Schema;

const participantSchema = new Schema({
  name: { type: String, required: true },
  matricule: { type: String, required: true },
});

const patrolSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "Daily Patrol",
      "Management Patrol",
      "Conversation Type Patrol",
      "Patrol kizuki",
    ],
  },
  number: { type: String, required: true },
  item: { type: String, required: true },
  solution: { type: String, required: true },
  area: { type: String, required: true },
  personInCharge: { type: String, required: true },
  personInChargeComment: { type: String },
  dueDate: { type: Date, required: true },
  progress: { type: Number, required: true, min: 0, max: 100 },
  photosBefore: [{ type: String }],
  photosAfter: [{ type: String }],
  confirmation: { type: Boolean, default: false },
  participants: [participantSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "open",
    enum: ["open", "ongoing", "closed"],
  },
});

let Patrol = mongoose.model("Patrol", patrolSchema);

export default Patrol;
