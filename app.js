var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ssshhhhh'}));
app.use(validator());
//app.use(express.static(__dirname + '../node_modules/bootstrap/dist'));

app.use('/tether', express.static(__dirname + '/node_modules/tether/dist/js')); // redirect jquery
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); // redirect jquery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

var index = require('./routes/index');
var join = require('./routes/join_application');
var joinCongrats = require('./routes/join_app_congrats');

var users = require('./routes/users');
var create1 = require('./routes/create_app_1');
var create2 = require('./routes/create_app_2');
var create3 = require('./routes/create_app_3');
var createCongrats = require('./routes/create_app_congrats');

var mysql = require('mysql'), // node-mysql module
    myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
      host: 'localhost',
      user: 'root',
      password: 'pass',
      port: 3303,
      database: 'sokppwr'
    };

app.use(myConnection(mysql, dbOptions, 'request'));

app.use('/', index);
app.use('/join_application', join);
app.use('/join_app_congrats', joinCongrats);
//app.use('/users', users);
app.use('/create_app_1', create1);
app.use('/create_app_2', create2);
app.use('/create_app_3', create3);
app.use('/create_app_congrats', createCongrats);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
