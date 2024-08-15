const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const featureSchema = new Schema({
    feature_name: { type: String, required: true },
    description: { type: String}
  });
  const packageSchema = new Schema({
    type:{ type: String, required: true },
    package_name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    features: [featureSchema]
  },
  {
    timestamps: true,
  });

const Package = models.Package || model("Package",packageSchema);
module.exports = Package;
