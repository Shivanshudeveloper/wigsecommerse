const mongoose = require("mongoose");
// Schema
const productsDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  instocks: {
    type: String,
  },
  onsale: {
    type: String,
  },
  freeshipping: {
    type: String,
  },
  freereturn: {
    type: String,
  },
  shipfrom: {
    type: String,
  },
  length: {
    type: String,
  },
  color: {
    type: String,
  },
  blackowned: {
    type: String,
  },
  producttype: {
    type: String,
  },
  origin: {
    type: String,
  },
  texture: {
    type: String,
  },
  basematerial: {
    type: String,
  },
  lacetype: {
    type: String,
  },
  preplucked: {
    type: String,
  },
  bleachedKnots: {
    type: String,
  },
  babyHairs: {
    type: String,
  },
  parting: {
    type: String,
  },
  closureSize: {
    type: String,
  },
  frontalSize: {
    type: String,
  },
  density: {
    type: String,
  },
  price: {
    type: String,
  },
  rating: {
    type: Number,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const products = mongoose.model("products", productsDataSchema);
module.exports = products;
