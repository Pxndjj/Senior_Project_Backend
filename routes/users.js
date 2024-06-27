const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connectMongoDB = require("./../libs/mongodb");
const User = require('../models/user'); // เพิ่มบรรทัดนี้
require('dotenv').config();
const userCtl = require("./../controllers/user-controller");
const adminCtl = require("./../controllers/admin-controller");

/* GET home page. */
router.get('/', async (req, res, next) => {
  console.log(process.env.ADMIN_DEFAULT);
  return res.json({ message: "this index user", data: [process.env.ADMIN_DEFAULT] });
});

router.get('/checkemailgoogle', async (req, res, next) => {
  try {
    let userEmail = req.query;
    let ret = await userCtl.checkEmailGoogle(userEmail);
    return res.json(ret);
  } catch (error) {
    console.log(error)
    return res.status(401).send("error");
  }
});

router.get('/checkuserregister', async (req, res, next) => {
  try {
    let credentials = req.query;
    let userEmail = credentials.userEmail;
    let userPhone = credentials.userPhone;
    let ret = await userCtl.checkUserRegister(userEmail,userPhone);
    return res.json(ret);
  } catch (error) {
    console.log(error)
    return res.status(401).send("error");
  }
});

router.get('/checkadmin', async (req, res, next) => {
  try {
    let credentials = req.query;
    let email = credentials.email;
    let ret = await adminCtl.checkAdmin(email);
    return res.json(ret);
  } catch (error) {
    console.log(error)
    return res.status(401).send("error");
  }
});

// Updated /register route with data validation
router.post('/register', async (req, res, next) => {
  try {
    const credentials = req.body;

    // ตรวจสอบข้อมูลก่อนดำเนินการต่อ
    if (!credentials.userEmail || !credentials.userName || !credentials.userPass || !credentials.userPhone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(credentials.userPass, 10);
    credentials.userPass = hashedPassword;
    credentials.userRegisBy = "credentials";

    let ret = await userCtl.create(credentials);

    return res.json(ret);
  } catch (error) {
    console.log(error);
    return res.status(401).send("error");
  }
});

router.post('/updaterole',async (req, res, next) =>{
  try {
    const credentials = req.body.data;
    let ret = await userCtl.updateRole(credentials);
    return res.json(ret);
  } catch (error) {
    console.log(error);
    return res.status(401).send("error");
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { userEmail, userPhone, userPass } = req.body;

    // ค้นหาผู้ใช้จากฐานข้อมูลด้วยอีเมลหรือเบอร์โทรศัพท์
    const user = await User.findOne({
      $or: [
        { userEmail: userEmail },
        { userPhone: userPhone }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(userPass, user.userPass);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // ส่งคืนข้อมูลผู้ใช้หรือ token
    return res.json({ message: "Login successful", user });
  } catch (error) {
    console.log('Error in login route:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
