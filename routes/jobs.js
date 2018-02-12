'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Jobs = require('../models/jobs');

// -- Get jobs page

router.get('/', (req, res, next) => {
  // if current user is student
  res.render('jobs/index');
  // if current user is employer
  // res.redirect('my-jobs')
});

// -- Get create jobs

router.get('/create-job', (req, res, next) => {
  res.render('jobs/create-job');
});

router.post('/create-job', (req, res, next) => {
  const position = req.body.position;
  const description = req.body.description;

  if (position === '' || description === '') {
    const data = {
      message: 'All fields are required'
    };
    return res.render('jobs/create-job', data);
  }
  const newJob = new Jobs({
    position,
    description,
    owner: req.session.currentUser._id
  });

  newJob.save()
    .then((response) => {
      res.redirect('/my-jobs');
    })
    .catch(next);
});

module.exports = router;
