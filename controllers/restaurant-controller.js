const Restaurant = require('./../models/restaurant');

const create = async (obj) => {
  let res = await Restaurant.create(obj);
  return res;
}
const update = async (obj) => {
  let res = await Restaurant.findOneAndUpdate({ _id: obj._id }, { $set: obj }, { new: true });
  return res;
}
const acceptRestuarant = async (id) => {
  const updateDoc = {
    $set: {
      status: 'active',
    },
};
  let res = await Restaurant.findOneAndUpdate({ _id: id }, { $set: updateDoc }, { new: true });
  return res;
}
const remove = async (id) => {
  const res = await Restaurant.findOneAndDelete({ _id: id });
  return res;
}
const findByID = async (id) => {
  const res = await Restaurant.find({ "refID": id });
  return res;
}
const findByRefID = async (refID) => {
  const res = await Restaurant.find({ "refID": refID });
  return res;
}
const findAll = async () => {
  const res = await Restaurant.find();
  return res;
}
const init = async (id) => {
  let ini = {
    "name": "",
    "refID": id,
    "latitude": 16.2407767,
    "longitude": 97.1406912,
    "address": "",
    "phone": "",
    "reservationRequired": false,
    "status": "inactive",
    "openingHours": {
      "monday": {
        "start": "07:00",
        "to": "21:00"
      },
      "tuesday": {
        "start": "07:00",
        "to": "21:00"
      },
      "wednesday": {
        "start": "07:00",
        "to": "21:00"
      },
      "thursday": {
        "start": "07:00",
        "to": "21:00"
      },
      "friday": {
        "start": "07:00",
        "to": "21:00"
      },
      "saturday": {
        "start": "07:00",
        "to": "21:00"
      },
      "sunday": {
        "start": "07:00",
        "to": "21:00"
      }
    },
    "notes": "",
    "conditions": [""],
    "logo": "no-brand.png"
  }

  let res = await Restaurant.create(ini);
  return res;
}
const sendMessageAccept = async (restaurantID,userName)=> {
 let recipient = { "user_id": restaurantID,"username":userName };
 let sender = { "user_id": 0,"username":"joyfulwait" };
  let msg = {
   "type": "general",
   "title": "Your information has been verified.",
   "message": "Your restaurant information will be displayed on the website for customers to search through the system.",
   "read":false,
   "recipient":recipient,
   "sender":sender,
   "data":{}
  }
  let res = await notificationMessage.create(msg);
  return res;
 }

module.exports = { sendMessageAccept,acceptRestuarant,init, create, update, remove, findByID, findAll,findByRefID }


