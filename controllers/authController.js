const mongoose = require('mongoose');
const User = mongoose.model('User');

const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'Your are now logged in',
});
