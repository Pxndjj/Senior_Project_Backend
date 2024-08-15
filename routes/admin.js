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
  //ตัวอย่างการใช้งาน localhost:3001/admin?id=661f59284cccdb34f1b1c816
  let id = req.query.id;
  let ret = await adminCtl.remove(id);
  return res.json(ret);  
} catch (error) {
  return res.status(401).send("error");
}

});

router.post('/',async (req, res, next) =>{
  try {
      //ส่งข้อมูลที่จะ update มาที่ body.data
    const data = req.body.data;
    let ret = await adminCtl.create(data);
    return res.json(ret);
  } catch (error) {
    return res.status(401).send("error");
  }
});

router.put('/:id',async (req, res, next) => {
  try {
  //localhost:3001/admin/66292b823b985a34d7f21311
  //แล้วส่งข้อมูลที่จะ update มาที่ body.data
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
    //localhost:3001/admin/get/66292b823b985a34d7f21311
    const id = req.params.id;
    let ret = await adminCtl.findByID(id);
    return res.json(ret);  
  } catch (error) {
    return res.status(401).send("error");    
  }

});
router.get('/all', async (req, res, next) => {
  try {
     //localhost:3001/admin/all
    let ret = await adminCtl.findAll();
    return res.json(ret); 
  } catch (error) {
    return res.status(401).send("error");       
  }

});



module.exports = router;
