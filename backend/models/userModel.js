import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/004/607/791/non_2x/man-face-emotive-icon-smiling-male-character-in-blue-shirt-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg",
  },
  role: {
    type: String,
    enum: ["admin", "RHSE", "AHSE", "RDEP", "OC"],
    default: "user",
  },
  account_status: {
    type: String,
    enum: ["pending", "rejected", "approved"],
    default: "pending",
  },
});

let userModel = mongoose.model("user", userSchema);

export default userModel;
