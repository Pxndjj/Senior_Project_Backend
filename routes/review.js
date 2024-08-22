var express = require('express');
var router = express.Router();
const review = require('../controllers/review-controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../storage/image/review/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/insert', upload.array('images', 10), async (req, res, next) => {
    let modelData = JSON.parse(req.body.modelData);

    if (req.files && req.files.length > 0) {
        const imageNames = req.files.map(file => file.originalname);
        modelData.imagename = imageNames;
    } else {
        modelData.imagename = []; // or set to null, depending on your database schema
    }

    try {
        let ret = await review.create(modelData);
        return res.json(ret);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create review', details: error.message });
    }
});


router.get('/all/:refID', async (req, res, next) => {
    try {
        const id = req.params.refID;
        let reviews = await review.findByRestaurantID(id);
        return res.json(reviews || []);
    } catch (error) {
        console.error(error);
        return res.status(401).send("Error fetching reviews");
    }
});

// Serve image by image name
router.get('/image/:imagename', async (req, res, next) => {
    try {
        const imageName = req.params.imagename;
        const imagePath = path.join(__dirname, '../storage/image/review', imageName);

        res.sendFile(imagePath, (err) => {
            if (err) {
                console.error(err);
                res.status(404).send('Image not found');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
