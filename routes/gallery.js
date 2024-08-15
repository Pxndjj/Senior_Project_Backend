var express = require('express');
var router = express.Router();
var galleryCtl = require('./../controllers/gallery-controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// กำหนดที่เก็บไฟล์ที่อัปโหลด
const uploadDir = path.join(__dirname, '../storage/image/gallery/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// กำหนด Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // กำหนดชื่อไฟล์ใหม่โดยใช้ timestamp กับชื่อเดิมของไฟล์
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });  
const removeGalleryFile= async (fileName)=>{
  // กำหนด path ของไฟล์ที่ต้องการลบ
const filePath = `${uploadDir}${fileName}`; // เปลี่ยนเป็น path จริงของไฟล์
  // ใช้ fs.unlinkSync เพื่อลบไฟล์โดยถาวร
try {
  if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
  }
} catch (err) {
  console.error('เกิดข้อผิดพลาดในการลบไฟล์:', err);
}
}

router.get('/', async (req, res, next) => {
  return res.json({ message: "this index gallery", data: [] });
});

router.get('/preview/:imageName', async (req, res, next) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(uploadDir, imageName);
  res.sendFile(imagePath, (err) => {
      if (err) {
          console.log(err);
          res.status(404).send('Image not found');
      }
  });
});

router.get('/getbyrefid/:refID', async (req, res, next) => {
  try {
  const refID = req.params.refID;
  let ret = await galleryCtl.findByRefID(refID);
  return res.json(ret);
} catch (error) {
  return res.status(401).send("error");
}
});

router.post('/', upload.array('images', 10),async (req, res, next) => {
  try {
    const refID = JSON.parse(req.body.refID);
    for (const _file of req.files) {
     let obj = {refID:refID,fileName:_file.filename};
     await galleryCtl.create(obj);
    }
    let ret = await galleryCtl.findByRefID(refID);
  return res.json(ret);
} catch (error) {
  console.log(error);
  return res.status(401).send("error");
}

});

router.delete('/del/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let objDelet = await galleryCtl.findByID(id);
    await removeGalleryFile(objDelet.fileName);
    await galleryCtl.remove(id);
    let ret = await galleryCtl.findByRefID(objDelet.refID);
    return res.json(ret);  
  } catch (error) {
    console.log(error);
    return res.status(401).send("error");
  }
  
  });


module.exports = router;
