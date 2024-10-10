// Library Default
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
moment.locale("en-US");

const axios = require('axios');

// Router
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const restaurantRoute = require('./routes/restaurant');
const storageRouter = require('./routes/storage');
const uploadfile = require('./routes/uploadfile');
const galleryRouter = require('./routes/gallery');
const queueRouter = require('./routes/queue');
const notificationRouter = require('./routes/notification-message');
const reviewRouter = require('./routes/review');

// Setup Default
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connectMongoDB = require("./libs/mongodb");

const setupDefaultAdmin = async () => {
  try {
    console.log('Setting up default admin...');
    const Admin = require("./models/admin");
    const Restaurant = require("./models/restaurant");
    await connectMongoDB();

    let resValue = (await Restaurant.find()).map((o) => {
      return o._id.toString();
    });

    const isDefault = await Admin.find();
    if (isDefault.length === 0) {
      await Admin.create({ "email": process.env.ADMIN_DEFAULT });
      console.log('Default admin created successfully.');
    } else {
      console.log('Default admin already exists.');
    }
  } catch (error) {
    console.error('Error setting up default admin:', error);
  }
};

setupDefaultAdmin();

// Define routes
app.use('/users', usersRouter);
app.use('/storage', storageRouter);
app.use('/admin', adminRouter);
app.use('/restaurant', restaurantRoute);
app.use('/gallery', galleryRouter);
app.use('/queue', queueRouter);
app.use('/notificationmessage', notificationRouter);
app.use('/uploadfile', uploadfile);
app.use('/review', reviewRouter);

// Location endpoint

const currentLocation = {
  latitude: 13.7563,
  longitude: 100.5018
};
app.use('/location', (req, res) => {
  res.json(currentLocation);
});


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});



// Queue controller
const queueCtl = require('../joyfulwait-backend/controllers/queue-controller');
const userCtl = require('../joyfulwait-backend/controllers/user-controller');
const verificationCtl = require('../joyfulwait-backend/controllers/verification-code-controller');
const sendlineCtl = require('../joyfulwait-backend/controllers/sendline-controller');


const sendMessageLine = async () => {
  try {
    const que = await queueCtl.findAll();
    const now = moment();

    const filteredQueue = que.filter((o) => {
      const bookingTime = moment(o.time_of_booking);
      return bookingTime.diff(now, 'minutes') <= 30 && bookingTime.diff(now, 'minutes') > 0;
    });

    for (const item of filteredQueue) {
      const user = await userCtl.findUserName(item.customer_name);
      const verification = await verificationCtl.findByUserID(user._id);
      const queueodl = await sendlineCtl.findByQueueID(item._id);



      if (verification && verification.lineID && (!queueodl[0] || queueodl[0].status !== "A")) {
        const lineID = verification.lineID;
        const TOKEN = process.env.LINE_ACCESS_TOKEN;

        try {
          const formattedTime = moment(item.time_of_booking).format('DD/MM/YYYY HH:mm');
          const message = `It's almost ${formattedTime} time, Customer can come to restaurant.`;

          const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
              to: lineID,
              messages: [
                {
                  type: 'text',
                  text: message,
                },
              ],
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
              },
            }
          );

          if (response.status === 200) {
            const obj = {
              queueID: item._id,
              status: "A" // success
            };
            await sendlineCtl.create(obj);
          } else {
            const obj = {
              queueID: item._id,
              status: "E" // error
            };
            await sendlineCtl.create(obj);
          }
        } catch (error) {
          console.error('Error sending message:', error.message || error);
        }
      }
    }
  } catch (error) {
    console.error('Error in sendMessageLine:', error);
  }
};






setInterval(sendMessageLine, 300000);
// setInterval(sendMessageLine, 10000);


module.exports = app;


