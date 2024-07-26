import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  quantity: Number,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  variants: [variantSchema],
});

export default mongoose.model("Product", productSchema);
