let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let User=require('./Model/User');
let cors = require('cors');
let bcrypt = require('bcrypt');
require("dotenv").config();

const { default: mongoose } = require('mongoose');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let adminRouter = require('./routes/admin');

let app = express();
app.use(cors())
mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1:3000/userdb",()=>{
// console.log("connected to mongodb")}) 


mongoose
  .connect("mongodb://127.0.0.1/userdb", {  })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handlers
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
