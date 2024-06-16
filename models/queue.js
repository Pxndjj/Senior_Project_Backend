const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const queueSchema = new Schema(
  {
    restaurant: { type: String, required: true },
    refID: { type: String, required: true }, 
    customer_name: { type: String, required: true },
    queue_number: {
      type: Number,
      required: true
    },
    queue_date: {
      type: String
    },
    queue_no: {
      type: String,
      required: true
    },
    time_of_booking: {
      type: Date,
      required: true
    },
    party_size: {
      type: Number,
      required: true
    },
    promotion: {
      type: String
    },
    queue_status: {
      type: String
    },
    queue_used: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);
const Queue = models.Queue || model("Queue", queueSchema);
module.exports = Queue;