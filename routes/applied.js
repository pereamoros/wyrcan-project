'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'student') {
    return res.redirect('/my-jobs');
  }

  const currentUser = req.session.currentUser._id;
  console.log(currentUser);

  User.findById(currentUser)
    .populate('appliedJobs')
    .then((user) => {
      const data = {
        appliedJobs: user.appliedJobs
      };
      res.render('jobs/applied', data);
    })
    .catch(next);
});

module.exports = router;
