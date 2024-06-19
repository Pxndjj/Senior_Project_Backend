const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const gallerySchema = new Schema(
  {
    refID: { type: String },
    fileName: { type: String }
  },
  {
    timestamps: true,
  }
);
const Gallery = models.Gallery || model("Gallery",gallerySchema);
module.exports = Gallery;

