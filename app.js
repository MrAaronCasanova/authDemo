var passportLocalMongoose = require('passport-local-mongoose');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local');
var bodyParser = require('body-parser');
var User = require('./models/user');
var mongoose = require('mongoose');
var passport = require('passport');
var express = require('express');
var ejs = require('ejs');
var app = express();

mongoose.connect('mongodb://localhost/auth_demo_app');
mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');

app.use(expressSession({
  secret: 'Moose is the best and cutest dog in the world!',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/secret', function (req, res) {
  res.render('secret');
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
