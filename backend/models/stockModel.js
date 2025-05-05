import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  product_name: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
});

let stockModel = mongoose.model("stock", stockSchema);

export default stockModel;
