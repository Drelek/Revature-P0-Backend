var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Set router file paths
var indexRouter = require('./routes/index');
var accountRouter = require('./routes/accounts');
var itemRouter = require('./routes/items');
var orderRouter = require('./routes/orders');
var sessionRouter = require('./routes/session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set routers to be used by the server
app.use('/', indexRouter);
app.use('/accounts', accountRouter);
app.use('/items', itemRouter);
app.use('/orders', orderRouter);
app.use('/session', sessionRouter);

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
