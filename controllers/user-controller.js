const User = require('../models/user');
const Admin = require("../models/admin");
const Restaurant = require("../models/restaurant");
const usePackage = require("../models/use-package");
const moment = require('moment');
moment.locale("en-US");
const create= async(obj)=>{
    let res = await User.create(obj);
    
    return res;
}
const update = async (obj)=>{
    let res = await User.findOneAndUpdate({_id:obj.id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await User.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await User.findById(id);
    return res;
}
const findAll= async ()=>{
    const res = await User.find();
    return res;
}
const checkEmailGoogle=async (userEmail)=>{
    const result = await User.findOne({ userEmail }).select("_id");
    return result;
}
const checkUserRegister = async (userEmail,userPhone)=>{
    const result = await User.findOne({ $or: [{ userEmail: userEmail }, { userPhone: userPhone }] });
    return result;
}
const checkAdmin = async (email)=>{
    const result = await Admin.findOne({ $or: [{ email: email }] });
    return result;
}

const initRestaurant = async (id)=>{
    let _ini = {
        "refID":id,
        "name": "Name of restaurant",
        "latitude": 13.729056,
        "longitude": 100.583809,
        "address": "Address",
        "phone": "xxx-xxx-xxxx",
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
        "notes": "หมายเหตุ",
        "conditions": ["Rules for using the service"],
        "logo": "",
    }
    let ret = await Restaurant.create(_ini);
    return ret;
}
const initPackage = async (refID)=>{
  let pkID = "664f62d6c88882f7559b2e3f";
  let start_date = moment();
  let end_date = moment().add(1, 'y');
  let obj = {package_id:pkID,refID:refID,status:"A",start_date:start_date,end_date:end_date};
  let res = await usePackage.create(obj);
  return res;
}


const updateRole = async (credentials)=>{
    let up = await User.findOneAndUpdate({_id:credentials.id},{userRole:credentials.role},{ returnOriginal: false }); 
    if (credentials.role=='restaurant') {
        let restaurant = await initRestaurant(credentials.id);
        await initPackage(restaurant._id);
    }
  
    return up;
}

module.exports ={
    initRestaurant,
    initPackage,
    updateRole,
    create,
    update,
    remove,
    findByID,
    findAll,
    checkEmailGoogle,
    checkUserRegister,
    checkAdmin
}


