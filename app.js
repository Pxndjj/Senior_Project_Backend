//Library Default
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment');
moment.locale("en-US");
//Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var restaurantRoute = require('./routes/restaurant');
var storageRouter = require('./routes/storage');
var queueRouter = require('./routes/queue');
var galleryRouter = require('./routes/gallery');
//Setup Default
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connectMongoDB = require("./libs/mongodb");
const setupDefaultAdmin=async()=>{
  const Admin = require("./models/admin");
  const Restaurant = require("./models/restaurant");
  await connectMongoDB();
  //alter data
  let resValue = (await Restaurant.find()).map((o)=>{
    return o._id.toString();
  })


  const isDefault = await Admin.find();
  if(isDefault.length==0){
    await Admin.create({"email":process.env.ADMIN_DEFAULT})
  }
}

setupDefaultAdmin();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/storage', storageRouter);
app.use('/admin',adminRouter);
app.use('/restaurant',restaurantRoute);
app.use('/queue',queueRouter);
app.use('/gallery',galleryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
