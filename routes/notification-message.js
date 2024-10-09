const express = require('express');
const router = express.Router();
const moment = require('moment');
const axios = require('axios');
const verificationCtl = require("./../controllers/verification-code-controller");

const fs = require('fs');
const path = require('path');
moment.locale("en-US");

const uploadDir = path.join(__dirname, '../storage/qrcode/');

router.post('/webhook', async (req, res) => {
  if (!req.body || !req.body.events || req.body.events.length === 0) {
    return res.status(400).send("No events found.");
  }

  const TOKEN = process.env.LINE_ACCESS_TOKEN;
  const event = req.body.events[0];
  const lineID = event.source.userId;
  const userMessage = event.message.text;

  if (event.type === "message") {
    try {
      const existingUser = await verificationCtl.findBylineID(lineID);

      if (!existingUser) {
        const allCodes = await verificationCtl.findAll();

        const matchingCode = allCodes.find(code => code.generatedCode === userMessage);

        if (matchingCode) {
          matchingCode.lineID = lineID;
          matchingCode.status = "A";
          await matchingCode.save();

          const dataString = JSON.stringify({
            replyToken: event.replyToken,
            messages: [
              { type: "text", text: "VerificationCode successfully" },
            ],
          });

          await axios.post("https://api.line.me/v2/bot/message/reply", dataString, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          });
        } else {
          console.log("No matching code found.");
        }
      } else {
        // ถ้ามี lineID และสถานะเป็น "A"
        if (existingUser.status === "A") {
          const dataString = JSON.stringify({
            replyToken: event.replyToken,
            messages: [
              { type: "text", text: "กรุณารอสักครู่ค่ะ/ครับ เจ้าหน้าที่ของเรากำลังดำเนินการและจะตอบกลับในไม่ช้านี้" },
            ],
          });

          await axios.post("https://api.line.me/v2/bot/message/reply", dataString, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          });

          return;
        }
      }

      const dataString = JSON.stringify({
        replyToken: event.replyToken,
        messages: [
          { type: "text", text: "Hello, user" },
          { type: "text", text: "May I help you?" },
        ],
      });

      const response = await axios.post("https://api.line.me/v2/bot/message/reply", dataString, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  }
});

router.post('/send/:lineID', async (req, res) => {

  console.log(123);

  const lineID = req.params.lineID;
  const { qrcode } = req.body;


  if (!qrcode) {
    return res.status(400).json({ message: 'QR code is required' });
  }

  // แปลง QR code จาก base64 เป็น buffer
  const base64Data = qrcode.split("base64,")[1];
  const buffer = Buffer.from(base64Data, 'base64');

  // สร้างชื่อไฟล์และเส้นทางเก็บภาพ
  const fileName = `qrcode_${Date.now()}.png`;
  const dirPath = path.join(uploadDir);

  // สร้างโฟลเดอร์ถ้ายังไม่มี
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, fileName);

  // บันทึกภาพ QR code ลงในเซิร์ฟเวอร์
  fs.writeFile(filePath, buffer, async (err) => {
    if (err) {
      console.error('Error saving QR code:', err);
      return res.status(500).json({ message: 'Failed to save QR code', error: err.message });
    }

    const TOKEN = process.env.LINE_ACCESS_TOKEN;

    try {
      // สร้าง URL สำหรับเข้าถึง QR code ที่บันทึกไว้
      const imageUrl = `https://myserver-api.com/storage/qrcode/${fileName}`;

      // ส่งภาพไปยัง LINE API
      const response = await axios.post('https://api.line.me/v2/bot/message/push', {
        to: lineID,
        messages: [
          {
            type: 'image',
            originalContentUrl: imageUrl, // ใช้ URL ของภาพที่บันทึกไว้
            previewImageUrl: imageUrl,
          },
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
      });

      res.status(200).json({ message: 'Image sent successfully', data: response.data });
    } catch (error) {
      console.error('Error sending message:', error.message || error);
      res.status(500).json({ message: 'Failed to send message', error: error.response?.data || error.message });
    }
  });
});

router.post('/generateVerificationCode', async (req, res) => {
  const { userID, generatedCode, status, lineID } = req.body;

  try {
    const existingVerification = await verificationCtl.findByUserID(userID);

    if (existingVerification) {
      return res.status(200).json(existingVerification);
    }

    const data = {
      userID,
      generatedCode,
      status,
      lineID
    };
    const newVerification = await verificationCtl.create(data);

    return res.status(201).json(newVerification);
  } catch (error) {
    return res.status(500).json({ message: "Error creating verification code", error });
  }
});

router.get('/checkverification/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const ret = await verificationCtl.findByUserID(userID);

    return res.status(201).json(ret);
  } catch (error) {
    return res.status(500).json({ message: "Error creating verification code", error });
  }
});



module.exports = router;
