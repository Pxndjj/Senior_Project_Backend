var express = require('express');
var router = express.Router();
const  adminCtl = require('./../controllers/admin-controller');
/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    return res.json({ message: "this index admin", data: [] }); 
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.delete('/', async (req, res, next) => {
try {
  let id = req.query.id;
  let ret = await adminCtl.remove(id);
  return res.json(ret);  
} catch (error) {
  return res.status(401).send("error");
}

});

router.post('/',async (req, res, next) =>{
  try {
    const data = req.body.data;
    let ret = await adminCtl.create(data);
    return res.json(ret);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.put('/:id',async (req, res, next) => {
  try {
  const id = req.params.id;
  const newData = req.body.data;
  let ret = await adminCtl.update(id,newData);
  return res.json(ret); 
  } catch (error) {
    return res.status(401).send("error");    
  }

});
router.get('/get/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    let ret = await adminCtl.findByID(id);
    return res.json(ret);  
  } catch (error) {
    return res.status(401).send("error");    
  }

});
router.get('/all', async (req, res, next) => {
  try {
    let ret = await adminCtl.findAll();
    return res.json(ret); 
  } catch (error) {
    return res.status(401).send("error");       
  }

});



module.exports = router;
