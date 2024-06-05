var express = require('express');
var router = express.Router();
var restaurantCtl = require("./../controllers/restaurant-controller");
var usePackageCtl = require("../controllers/use-package-controller");
var notificationCtl = require("../controllers/notification-controller");
var packageCtl = require("../controllers/package-controller");
const path = require('path');
const fs = require('fs');


const multer = require('multer');


const upload = multer({ dest: 'storage/image/logo' });

router.get('/', async (req, res, next) => {
  return res.json({ message: "this index restuarant", data: [] });
});

router.get('/all', async (req, res, next) => {
  let _data = await restaurantCtl.findAll();
  return res.json(_data);
});

router.post('/update', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.body.modelData) {
      throw new Error("Missing modelData in request body");
    }

    const obj = JSON.parse(req.body.modelData);
    const cr = await restaurantCtl.update(obj);

    if (req.file) {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, '../storage/image/logo/' + cr._id + obj.logo);
      
      fs.rename(tempPath, targetPath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Failed to move file");
        }
      });
    }
    return res.json(cr);
  } catch (error) {
    console.error(error);
    return res.status(401).send(error.message);
  }
});

router.get('/get', async (req, res, next) => {
  try {
    const id = req.query.id;
    let result = await restaurantCtl.findByID(id);
    return res.json(!result ? result : result[0]);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.get('/getdatapagebyrefid/:refid', async (req, res, next) => {
  try {
    const refid = req.params.refid;
    let result = await restaurantCtl.findByRefID(refid);
    let resID = result ? result[0]._id : 0;
    let usePackage = await usePackageCtl.findByRefID(resID);
    let notificationMessage = await notificationCtl.findByRestuarantID(resID);
    let package_id=usePackage?usePackage[0].package_id:0;

    let packageDetail  = await packageCtl.findByID(package_id);
    let packageData = {
      usePackage:usePackage?usePackage[0]:usePackage,
      packageDetail:packageDetail?packageDetail:packageDetail,
      notifications:notificationMessage}
    return res.json(packageData);
  } catch (error) {
    console.log(error);
    return res.status(401).send("error");
  }
});

router.get('/acceptrestaurant/:refid', async (req, res, next) => {
  try {
    const refid = req.params.refid;
    let result = await restaurantCtl.acceptRestuarant(refid);
    await notificationCtl.update();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(401).send("error");
  }
});



module.exports = router;
