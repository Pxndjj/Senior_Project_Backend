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


//Setup Default
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connectMongoDB = require("./libs/mongodb");
const setupDefaultAdmin=async()=>{
  const Admin = require("./models/admin");
  // const Restaurant = require("./models/restaurant");
  // const UsePackage = require("./models/use-package");
  await connectMongoDB();
  //alter data
  keyPackageFree = "664f62d6c88882f7559b2e3f";
  // let resValue = (await Restaurant.find()).map((o)=>{
  //   return o._id.toString();
  // })
  // let resUsePackageValue = (await UsePackage.find()).map((o)=>{
  //   return o.refID;
  // })
//   let dataToAlter = resValue.filter(_id => 
//     !resUsePackageValue.some(_id2 => _id2 === _id)
// );
// for (const id of dataToAlter) {
//   let start_date = moment();
//   let end_date = moment().add(1, 'y');
//   let objCreate = {
//     "package_id":keyPackageFree,
//     "refID":id,
//     "status":"active",
//     "start_date":start_date,
//     "end_date":end_date
//   }
//   await UsePackage.create(objCreate);
// }
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
