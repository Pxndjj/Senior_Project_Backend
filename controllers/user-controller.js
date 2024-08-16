const User = require('../models/user');
const Admin = require("../models/admin");
const Restaurant = require("../models/restaurant");
const usePackage = require("../models/use-package");
const packageCtl = require("../controllers/package-controller");
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
const initPackage = async (refID) => {
  let pkID = await packageCtl.getID();
  let start_date = moment();
  let end_date = moment().add(1, 'y');
  let obj = { package_id: pkID, refID: refID, status: "A", start_date: start_date, end_date: end_date };
  let res = await usePackage.create(obj);
  return res;
}

const initMessageUser = async (restaurantID, userName) => {
  let recipient = { "user_id": restaurantID, "username": userName };
  let sender = { "user_id": 0, "username": "joyfulwait" };
  let data = "http://www.google.co.th";
  let msg = {
    "type": "general",
    "read": false,
    "recipient": recipient,
    "sender": sender,
    "data": data,
    "timestamp": moment(new Date()).format("YYYY-MM-DD"),
  }
  let res = await notificationMessage.create(msg);
  return res;
}


const updateRole = async (credentials) => {
  let _user = await User.findOneAndUpdate({ _id: credentials.id }, { userRole: credentials.role }, { returnOriginal: false });
  if (credentials.role == 'restaurant') {
    let restaurant = await initRestaurant(_user._id);
    await initPackage(restaurant._id);
  }
  if (credentials.role == 'user') {
    await initPackage(_user.id, _user.userName);
  }
  return _user;
}

module.exports = {
  initRestaurant,
  initPackage,
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


