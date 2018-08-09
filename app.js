var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connection = require('express-myconnection');
var mysql = require('mysql');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('express-flash');
var Sequelize = require('sequelize');
/*var con = mysql.createConnection({
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'test'
});*/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser('keyboard cat'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'keyboard cat', 
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

//sequelize connection
const sequelize = new Sequelize('test', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  define: { 
    freezeTableName: true,
  },
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});
  
app.use(function(req, res, next){
  req.conn = sequelize;
  next();
});

/*connection using middleware
app.use(
  connection(mysql, {

    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306, //port mysql
    database: 'test'

  }, 'pool') 
);*/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

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

app.listen(3300, function(req, res){
  console.log('Server listen to port:5000');
});