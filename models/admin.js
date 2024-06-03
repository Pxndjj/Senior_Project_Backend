const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const adminSchema = new Schema(
  {
    email: { type: String },
  },
  {
    timestamps: true,
  }
);
const Admin = models.Admin || model("Admin", adminSchema);
module.exports = Admin;