var express = require('express');
var router = express.Router();
const queueCtl = require('../controllers/queue-controller');
const restaurantCtl = require('../controllers/restaurant-controller');


router.get('/', async (req, res, next) => {
  try {
    return res.json({ message: "this index queue", data: [] });
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body.data;
    let restaurant = await restaurantCtl.findByID(data.refID);
    data.restaurant = restaurant[0].name
    data.refID = restaurant[0]._id.toString()
    let ret = await queueCtl.create(data);
    return res.json(ret);
  } catch (error) {
    console.log(error);
    return res.status(401).send("error");
  }
});

router.post('/updateQueue', async (req, res, next) => {
  try {
    const newData = req.body.data;
    let ret = await queueCtl.update(newData);
    return res.json(ret);
  } catch (error) {
    return res.status(401).send("error");
  }

});
router.get('/get/:id?', async (req, res, next) => {
  try {
    const id = req.query.id;
    let ret = await queueCtl.findByID(id);
    return res.json(ret);
  } catch (error) {
    return res.status(401).send("error");
  }

});
router.get('/all/:refid', async (req, res, next) => {
  try {
    const refID = req.params.refid;
    let restaurantID = await restaurantCtl.findByID(refID);
    let ret = await queueCtl.findAllbyRefID(restaurantID[0]._id.toString());
    return res.json(ret);
  } catch (error) {
    return res.status(401).send("error");
  }

});

router.post('/nextqueue', async (req, res, next) => {
  try {
    const data = req.body;
    let ret = await queueCtl.nextQueue(data.refID, data.queue_status);
    return res.json(ret);
  } catch (error) {
    return res.status(401).send("error");
  }

});


module.exports = router;
