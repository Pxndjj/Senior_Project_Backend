var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const connectMongoDB = require("./../libs/mongodb");
require('dotenv').config()
const userCtl = require("./../controllers/user-controller");
const adminCtl = require("./../controllers/admin-controller");

/* GET home page. */
router.get('/', async (req, res, next) => {
  console.log(process.env.ADMIN_DEFAULT);
  return res.json({ message: "this index user", data: [process.env.ADMIN_DEFAULT] });
});

router.get('/count', (req, res, next) => {
  userCtl.countUsers()
      .then(restaurants => {
          res.json(restaurants);
      })
      .catch(err => {
          console.log('error get restaurant', err);
          res.status(500).send(err);
      });
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

// await connectMongoDB();
// const resUser = await User.findOne({ $or: [{ userEmail: credentials.userEmail }, { userPhone: credentials.userPhone }] });
// create user จากการ register
router.post('/register', async (req, res, next) => {
  try {
    const credentials = req.body;
    const hashedPassword = await bcrypt.hash(credentials.userPass, 10);
    credentials.userPass = hashedPassword;
    credentials.userRegisBy = "credentials";
    let ret = await userCtl.create(credentials);

    return res.json(ret);
  } catch (error) {
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
})

module.exports = router;
