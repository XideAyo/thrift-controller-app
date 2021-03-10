var createError = require('http-errors')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const uuid = require('uuid')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const store = new MongoDBStore({
    uri: process.env.MONGO_TEST,
    collection: 'sessions'
})
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(session({
    cookie: {
        maxAge : 864e5
    },
    secret : process.env.SESSION_SECRET,
    resave : false,
    store: store,
    saveUninitialized: true,
    unset: 'destroy',
    genid: (req) => {
        return uuid.v4()
    }
}))
//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//catch 404 and forward to  error handler
app.use(function(req,res,next){
    next(createError(404));
});

//error-handler
app.use(function(err,req,res,next) {
    //set locals,only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err: {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');
})

//Connecting to database
const CONFIG = {
    uri:process.env.MONGO_TEST,
    OPTIONS: {
        useNewUrlParser : true ,
        useCreateIndex: true ,
        poolSize : 10 ,
        keepAlive : true,
        useUnifiedTopology : true,
        keepAliveInitialDelay: 3e6
    }
}

mongoose.connect(CONFIG.uri, CONFIG.OPTIONS)
let db = mongoose.connection
db.on("error", () => console.error("Database Error"))
db.on("open", () => console.log("Database is connected"))

module.exports = app;
