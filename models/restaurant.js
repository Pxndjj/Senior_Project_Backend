const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const restaurantSchema = new Schema({
  refID: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  reservationRequired: {
    type: Boolean
  },
  status: {
    type: String,
    enum: ['active', 'inactive']
  },
  openingHours: {
    type: {
      monday: { start: String, to: String, open: String },
      tuesday: { start: String, to: String, open: String },
      wednesday: { start: String, to: String, open: String },
      thursday: { start: String, to: String, open: String },
      friday: { start: String, to: String, open: String },
      saturday: { start: String, to: String, open: String },
      sunday: { start: String, to: String, open: String }
    },
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  conditions: {
    type: [String],
    required: false
  },
  logo: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
});

const Restaurant = models.Restaurant || model("Restaurant", restaurantSchema);
module.exports = Restaurant;