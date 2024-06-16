const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const queueRunningSchema = new Schema(
  {
    refID: { type: String },
    run_by: { type: String },
    auto_sequence: {type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
const QueueRunning = models.QueueRunning || model("QueueRunning",queueRunningSchema);
module.exports = QueueRunning;

