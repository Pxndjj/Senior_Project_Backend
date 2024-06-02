const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const userSchema = new Schema(
  {
    userName: { type: String },
    userRole: { type: String },
    userRegisBy: { type: String },
    userPass: { type: String },
    userPhone: { type: String },
    userEmail: { type: String },
    userImage: { type: String },
    userStatus: {type: String}
  },
  {
    timestamps: true,
  }
);
const User = models.User || model("User",userSchema);
module.exports = User;
