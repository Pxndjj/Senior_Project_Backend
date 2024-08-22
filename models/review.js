const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const reviewSchema = new Schema(
  {
    restaurantID: { type: String, required: true },
    userID: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    imagename: { type: [String], required: false },
  },
  {
    timestamps: true,
  }
);

const Review = models.Review || model("Review", reviewSchema);
module.exports = Review;
