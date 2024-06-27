const User = require('../models/user');
const bcrypt = require('bcrypt');
const moment = require('moment');
const Restaurant = require("../models/restaurant");
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

const checkEmailGoogle = async (userEmail) => {
    const result = await User.findOne({ userEmail }).select("_id");
    return result;
}

const checkUserRegister = async (userEmail, userPhone) => {
    const result = await User.findOne({ $or: [{ userEmail: userEmail }, { userPhone: userPhone }] });
    return result;
}

const initRestaurant = async (id) => {
    let _ini = {
        "refID": id,
        "name": "restaurant name",
        "latitude": 0,
        "longitude": 0,
        "address": "address",
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
        "notes": "notes",
        "conditions": ["conditions"],
        "logo": "",
    }
    let ret = await Restaurant.create(_ini);
    return ret;
}

const updateRole = async (credentials) => {
    let up = await User.findOneAndUpdate({ _id: credentials.id }, { userRole: credentials.role }, { returnOriginal: false });
    if (credentials.role == 'restaurant') {
        let restaurant = await initRestaurant(credentials.id);
    }

    return up;
}

const register = async (req, res) => {
    const { userEmail, userName, userPass, userPhone } = req.body;

    // ตรวจสอบว่าไม่มีช่องว่าง
    if (!userEmail || !userName || !userPass || !userPhone) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(userPass, 10);

    // ดำเนินการสร้างผู้ใช้ใหม่
    try {
        const newUser = new User({
            userEmail,
            userName,
            userPass: hashedPassword,
            userPhone,
            userRole: 'user',
            userRegisBy: 'credentials',
            userImage: 'default',
            userStatus: 'W',
        });

        await newUser.save();
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const findByEmail = async (userEmail) => {
    const res = await User.findOne({ userEmail });
    return res;
}

module.exports = {
    updateRole,
    create,
    update,
    remove,
    findByID,
    findAll,
    checkEmailGoogle,
    checkUserRegister,
    register,
    findByEmail,
}
