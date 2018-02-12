'use strict';

const express = require('express');
const router = express.Router();
// const User = require('../models/users');
const Job = require('../models/jobs');

/* GET jobs */
router.get('/', (req, res, next) => {
  if (req.session.currentUser.role === 'employer') {
    return res.redirect('my-jobs');
  }
  Job.find()
    .then((jobs) => {
      res.render('jobs/index', {jobs});
    })
    .catch(err => {
      return next(err);
    });
});

/* GET create jobs */
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
  const newJob = new Job({
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

router.get('/:id', (req, res, next) => {
  if (req.session.currentUser === 'student') {
    res.redirect('/:id/apply');
  }
  const jobId = req.params.id;
  Job.findById(jobId)
    .then((job) => {
      res.render('jobs/job-id', {job});
    })
    .catch(next);
});

router.get('/:id/apply', (req, res, next) => {
  if (req.session.currentUser === 'employer') {
    res.redirect('/:id');
  }
});

module.exports = router;
