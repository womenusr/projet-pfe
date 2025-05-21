import mongoose from "mongoose";

const bonDeSortieSchema = new mongoose.Schema({
  departement: {
    type: String,
    required: true,
  },
  datePrelevement: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const stockSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  stock_limit: {
    type: Number,
    required: true,
  },
  bonDeSortie: [bonDeSortieSchema],
});

const stockModel = mongoose.model("stock", stockSchema);

export default stockModel;
