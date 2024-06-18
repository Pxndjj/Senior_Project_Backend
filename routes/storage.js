var express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// const Storage = require("./../models/storage");
const connectMongoDB = require("./../libs/mongodb");

const multer = require('multer');
const upload = multer({ dest: 'storage/image/logo' });
const uploadDir = path.join(__dirname, '../storage/image/logo/');

router.get("/", async function (req, res) {
    res.status(200).send("storage");
});

router.get('/image/:logo', async (req, res, next) => {
    try {
        const imageName = req.params.logo;
        const imagePath = path.join(uploadDir, imageName);
        res.sendFile(imagePath, (err) => {
            if (err) {
                console.log(err);
                res.status(404).send('Image not found');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/createlogo', upload.single('file'), async function (req, res) {
    try {
        const tempPath = req.file.path;
        const uploadId = req.body.uploadId;

        const targetPath = path.join(__dirname, '../storage/image/logo/' + uploadId + ".jpeg");
        fs.rename(tempPath, targetPath, (err) => {
            if (err) throw err;
            res.sendStatus(200);
        });
    } catch (error) {
        console.error('Error saving file: ', error);
        res.sendStatus(500);
    }
});

module.exports = router;