'use strict';

const express = require('express');
const routes = express.Router();
const User = require('../models/users');

// GET SignUp
routes.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/signup');
});

// POST SignUp
routes.post('/signup', (req, res, next) => {
  if (req.session.User) {
    res.redirect('/');
  }

  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  // Validate
  if (username === '' || password === '' || password.length < 8 || !password.match(/[A-Z]/)) {
    const data = {
      message: 'All fields are required. Password needs to be 8 characters long and at least one capitalized letter.'
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
        message: 'The "' + username + '" username is taken'
      };
      return res.render('auth/signup', data);
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashPass
    });

    newUser.save()
      .then((response) => {
        req.session.currentUser = newUser;
        res.redirect('/');
      })
      .catch(next);
  });
});

routes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* handle the POST from the login form. */
routes.post('/login', (req, res, next) => {
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

routes.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = routes;
