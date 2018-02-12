'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/users');
const bcryptSalt = 10;

/* GET auth page. */
router.get('/', (req, res, next) => {
  res.redirect('/');
});

/* GET LogIn. */
router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/login');
});

/* POST LogIn */
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    const data = {
      message: 'Indicate a username and a password to log in'
    };
    return res.render('auth/login', data);
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const data = {
        message: 'Username does not exist'
      };
      return res.render('auth/login', data);
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      if (user.role === 'student') {
        res.redirect('/jobs');
      } else if (user.role === 'employer') {
        res.redirect('/my-jobs');
      }
    } else {
      const data = {
        message: 'Password is incorrect'
      };
      res.render('auth/login', data);
    }
  });
});

/* GET SignUp */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/signup');
});

/* POST SignUp */
router.post('/signup', (req, res, next) => {
  if (req.session.User) {
    res.redirect('/');
  }

  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  // Validation
  if (name === '' || username === '' || password === '' || role === undefined) {
    const data = {
      message: 'All fields are required.'
    };
    return res.render('auth/signup', data);
  }
  if (password.length < 8) {
    const data = {
      message: 'Password needs to be 8 characters long.'
    };
    return res.render('auth/signup', data);
  }
  if (!password.match(/[A-Z]/)) {
    const data = {
      message: 'Password needs to include at least one capitalized letter.'
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
        message: '"' + username + '" username is taken'
      };
      return res.render('auth/signup', data);
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashPass,
      role
    });

    newUser.save()
      .then((response) => {
        req.session.currentUser = newUser;
        if (newUser.role === 'student') {
          res.redirect('/jobs');
        } else if (newUser.role === 'employer') {
          res.redirect('/my-jobs');
        }
      })
      .catch(next);
  });
});

/* POST LogOut */
router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;
