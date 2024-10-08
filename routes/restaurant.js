var express = require('express');
var router = express.Router();
var restaurantCtl = require("./../controllers/restaurant-controller");
const path = require('path');
const fs = require('fs');

const multer = require('multer');

const upload = multer({ dest: 'storage/image/logo' });

router.get("/count", (req, res, next) => {
  restaurantCtl
    .countRestaurants()
    .then((restaurant) => {
      res.json(restaurant);
    })
    .catch((err) => {
      console.log("error get restaurant", err);
      res.status(500).send(err);
    });
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
    let result = await restaurantCtl.findByRefID(id);
    return res.json(!result ? result : result[0]);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.get('/get/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    let result = await restaurantCtl.findByID(id);
    return res.json(!result ? result : result[0]);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.get('/getRefID/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    let result = await restaurantCtl.findByRefID(id);
    return res.json(!result ? result : result[0]);
  } catch (error) {
    return res.status(401).send("error");
  }
});

module.exports = router;
