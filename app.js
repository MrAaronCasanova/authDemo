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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: 'Moose is the best and cutest dog in the world!',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================================================
// BASIC ROUTES
// ================================================

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/secret', isLoggedIn, function (req, res) {
  res.render('secret');
});

// ================================================
// AUTH ROUTES
// ================================================

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/secret');
    });
  });
});

// ================================================
// LOGIN ROUTES
// ================================================

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login',
}), function (req, res) {});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

// ================================================
// Server Config
// ================================================
app.listen(3000, function () {
  console.log('Server started on port 3000');
});
