// Library Default
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
moment.locale("en-US");

// Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restaurantRoute = require('./routes/restaurant');
var storageRouter = require('./routes/storage');
var queueRouter = require('./routes/queue');
var galleryRouter = require('./routes/gallery');

// Setup Default
var app = express();
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connectMongoDB = require("./libs/mongodb");
const setupDefaultAdmin = async () => {
  const Restaurant = require("./models/restaurant");
  await connectMongoDB();
  let resValue = (await Restaurant.find()).map((o) => {
    return o._id.toString();
  });
}

setupDefaultAdmin();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/storage', storageRouter);
app.use('/restaurant', restaurantRoute);
app.use('/queue', queueRouter);
app.use('/gallery', galleryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);

  // Change the response to JSON format
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
