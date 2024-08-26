const User = require('../models/user');
const Admin = require("../models/admin");
const Restaurant = require("../models/restaurant");
const moment = require('moment');
moment.locale("en-US");
const create = async (obj) => {
  let res = await User.create(obj);

  return res;
}
const update = async (obj) => {
  let res = await User.findOneAndUpdate({ _id: obj.id }, { $set: obj }, { new: true });
  return res;
}
const remove = async (id) => {
  const res = await User.findOneAndDelete({ _id: id });
  return res;
}
const findByID = async (id) => {
  const res = await User.findById(id);
  return res;
}
const findAll = async () => {
  const res = await User.find();
  return res;
}
const countUsers = async () => {
  const count = await User.countDocuments();
  return count;
};
const checkEmailGoogle = async (userEmail) => {
  const result = await User.findOne({ userEmail }).select("_id");
  return result;
}
const checkUserRegister = async (userEmail, userPhone) => {
  const result = await User.findOne({ $or: [{ userEmail: userEmail }, { userPhone: userPhone }] });
  return result;
}
const checkAdmin = async (email) => {
  const result = await Admin.findOne({ $or: [{ email: email }] });
  return result;
}

const initRestaurant = async (id) => {
  let _ini = {
    "refID": id,
    "name": "ไม่ระบุ",
    "latitude": 13.729056,
    "longitude": 100.583809,
    "address": "ไม่ระบุ",
    "phone": "000-000-0000",
    "reservationRequired": true,
    "status": "inactive",
    "openingHours": {
      "monday": {
        "start": "09:00",
        "to": "00:00",
        "open": "off"
      },
      "tuesday": {
        "start": "09:00",
        "to": "00:00",
        "open": "off"
      },
      "wednesday": {
        "start": "09:00",
        "to": "00:00",
        "open": "off"
      },
      "thursday": {
        "start": "09:00",
        "to": "00:00",
        "open": "off"
      },
      "friday": {
        "start": "09:00",
        "to": "00:00",
        "open": "off"
      },
      "saturday": {
        "start": "09:00",
        "to": "00:00",
        "open": "off"
      },
      "sunday": {
        "start": "09:00",
        "to": "00:00",
        "open": "off"
      }
    },
    "notes": "ไม่ระบุ",
    "conditions": ["ไม่ระบุ"],
    "logo": "",
  }
  let ret = await Restaurant.create(_ini);
  return ret;
}

// const initMessageRestaurant = async (restaurantID, userName) => {
//   // message รออนุมัติ

//   let recipient = { "user_id": restaurantID, "username": userName };
//   let sender = { "user_id": 0, "username": "joyfulwait" };
//   let msg = {
//     "type": "wait",
//     "title": "Greetings, your information is currently under review.",
//     "message": "Package เริ่มต้นที่ทาง Joyfulwait คือ Free Package ซึ่งฟีเจอร์เบื้องต้นสามารถจองคิวและสร้างเพจได้",
//     "read": false,
//     "recipient": recipient,
//     "sender": sender,
//     "timestamp": moment(new Date()).format("YYYY-MM-DD"),
//     "data": {}
//   }
//   let res = await notificationMessage.create(msg);
//   return res;
// }
// const initMessageUser = async (restaurantID, userName) => {
//   // message แนะนำ Promotion
//   let recipient = { "user_id": restaurantID, "username": userName };
//   let sender = { "user_id": 0, "username": "joyfulwait" };
//   let data = "http://www.google.co.th";
//   let msg = {
//     "type": "general",
//     "title": "สวัสดีค",
//     "message": "Package เริ่มต้นที่ทาง Joyfulwait คือ Free Package ซึ่งฟีเจอร์เบื้องต้นสามารถจองคิวและสร้างเพจได้",
//     "read": false,
//     "recipient": recipient,
//     "sender": sender,
//     "data": data,
//     "timestamp": moment(new Date()).format("YYYY-MM-DD"),
//   }
//   let res = await notificationMessage.create(msg);
//   return res;
// }

const updateRole = async (credentials) => {
  let _user = await User.findOneAndUpdate({ _id: credentials.id }, { userRole: credentials.role }, { returnOriginal: false });
    if (credentials.role == 'restaurant') {
    let restaurant = await initRestaurant(_user._id);
    // await initMessageRestaurant(restaurant._id, _user.userName);
  }
  // if (credentials.role == 'user') {
  //   await initMessageUser(_user.id, _user.userName);
  // }
  return _user;
}

module.exports = {
  initRestaurant,
  updateRole,
  create,
  update,
  remove,
  findByID,
  findAll,
  countUsers,
  checkEmailGoogle,
  checkUserRegister,
  checkAdmin
}


