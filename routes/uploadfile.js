var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var uploadfileCtl = require("../controllers/uploadfile-controller");
const uploadDir = path.join(__dirname, '../uploads/');


const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        const id = req.body.id;
        const file = req.file;

        const tempPath = file.path;
        const targetPath = path.join(__dirname, '../uploads/' + file.filename + path.extname(file.originalname));

        fs.rename(tempPath, targetPath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error moving file");
            }
            res.sendStatus(200);
        });

        let dataFile = {
            refID: id,
            fileName: file.filename + path.extname(file.originalname)
        }

        let result = await uploadfileCtl.create(dataFile);
        return res.json(!result ? result : result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});


router.get('/get/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        let ret = await uploadfileCtl.findByRefID(id);
        return res.json(ret);
    } catch (error) {
        return res.status(401).send("error");
    }

});

router.get('/preview/:file', async (req, res, next) => {
    const fileName = req.params.file;

    const filePath = path.join(uploadDir, fileName);

    // ตรวจสอบการมีอยู่ของไฟล์
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return res.status(404).send('File not found');
        }

        // ตั้งค่า Content-Type สำหรับไฟล์ PDF หรือไฟล์อื่นๆ ที่ต้องการ
        res.setHeader('Content-Type', 'application/pdf'); // ปรับตามประเภทไฟล์
        res.sendFile(filePath, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error sending file');
            }
        });
    });
});

module.exports = router;
