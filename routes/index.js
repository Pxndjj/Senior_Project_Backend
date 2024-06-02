var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.json({message:"this index",data:[]});
});

router.post('/', async = (req, res, next)=>{
let data = req.body;
return res.json(data);
});

module.exports = router;
