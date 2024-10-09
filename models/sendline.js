const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const sendlineSchema = new Schema(
  {
    queueID: { type: String },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

const Sendline = models.Sendline || model("Sendline", sendlineSchema);
module.exports = Sendline;
