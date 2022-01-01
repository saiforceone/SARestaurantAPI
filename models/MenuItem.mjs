/**
 * @description This represents a menu item
 */

import mongoose from "mongoose";
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
  itemName: { required: true, trim: true, type: String },
  description: { required: true, trim: true, type: String },
  baseCost: { default: 0, min: 0, type: Number },
  mainImage: { trim: true, type: String }, // todo: add url validation
  averageRating: { default: 0, type: Number },
  availableLocations: {
    ref: "RestaurantLocation",
    type: Schema.Types.ObjectId,
  },
});

export default mongoose.model("MenuItem", MenuItemSchema);
