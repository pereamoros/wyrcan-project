'use strict';

const express = require('express');
const authRoutes = express.Router();
const User = require('../models/users');

authRoutes.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  const data = {
    title: 'Signup'
  };
  res.render('auth/signup', data);
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* handle the POST from the login form. */
authRoutes.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    const data = {
      title: 'Login',
      message: 'Indicate a username and a password to sign up'
    };
    return res.render('auth/login', data);
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      return res.render('auth/login', data);
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      res.render('auth/login', data);
    }
  });
});

authRoutes.post('/signup', (req, res, next) => {
  if (req.session.User) {
    res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  // Validate
  if (username === '' || password === '' || password.length < 8 || !password.match(/[A-Z]/)) {
    const data = {
      title: 'Signup',
      message: 'Try again'
    };
    return res.render('auth/signup', data);
  }

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('auth/signup', data);
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = newUser;
      res.redirect('/');
    });
  });
});

authRoutes.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = authRoutes;
