var express = require('express');
var router = express.Router();
var usePackageCtl = require('../controllers/use-package-controller');

router.get('/', async (req, res, next) => {
  return res.json({ message: "this index package", data: [] });
});
router.get('/getbyid/:id', async (req, res, next) => {
  try {
  const id = req.params.id;
  let ret = await usePackageCtl.findByID(id);
  return res.json(ret);
} catch (error) {
    console.log(error)
    return res.status(401).send("error");
}
});
router.get('/getbyrefid/:refid', async (req, res, next) => {
    try {
    const refid = req.params.refid;
    let ret = await usePackageCtl.findByRefID(refid);
    return res.json(ret);
  } catch (error) {
      console.log(error)
      return res.status(401).send("error");
  }
  });
router.post('/', async (req, res, next) => {
  try {
    const data = req.body.data;
    let ret = await usePackageCtl.create(data);
    return res.json(ret);
} catch (error) {
  console.log(error);
  return res.status(401).send("error");
}

});
router.delete('/del/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    await usePackageCtl.remove(id);
    return res.json(ret);  
  } catch (error) {
    console.log(error);
    return res.status(401).send("error");
  }
  
});
router.put('/:id',async (req, res, next) => {
    try {
    //แล้วส่งข้อมูลที่จะ update มาที่ body.data
    const id = req.params.id;
    const newData = req.body.data;
    let ret = await usePackageCtl.update(id,newData);
    return res.json(ret); 
    } catch (error) {
      return res.status(401).send("error");    
    }
  
});


module.exports = router;
