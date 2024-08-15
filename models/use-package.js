const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const usePackageSchema = new Schema(
  {
    package_id: { type: String, required: true },
    refID: { type: String, required: true },
    status: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
const UserPackage = models.UserPackage || model("UserPackage", usePackageSchema);
module.exports = UserPackage;