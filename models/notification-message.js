const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

// สร้าง Schema สำหรับผู้รับ (Recipient) และผู้ส่ง (Sender)
const UserNotiSchema = new Schema({
    user_id: { type: String, required: true },
    username: { type: String, required: true }
  });

// สร้าง Schema สำหรับ Notification
const NotificationMessageSchema = new Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true },
    read: { type: Boolean, default: false },
    recipient: { type: UserNotiSchema, required: true },
    sender: { type: UserNotiSchema, required: true },
    data: { type: Schema.Types.Mixed, required: false },
  },{
    timestamps: true,
  });  

const NotificationMessage = models.NotificationMessage || model("NotificationMessage", NotificationMessageSchema);
module.exports = NotificationMessage;