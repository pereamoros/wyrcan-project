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
    .catch(next);
});

/* GET create jobs */
router.get('/create-job', (req, res, next) => {
  res.render('jobs/create-job');
});

/* POST create jobs */
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
    owner: req.session.currentUser._id,
    archive: false
  });

  newJob.save()
    .then((response) => {
      res.redirect('/my-jobs');
    })
    .catch(next);
});

/* GET job id */
router.get('/:id', (req, res, next) => {
  if (req.session.currentUser.role === 'student') {
    const id = req.params.id;
    res.redirect('/jobs/' + id + '/apply');
  }
  const jobId = req.params.id;
  Job.findById(jobId)
    .then((job) => {
      res.render('jobs/job-id', {job});
    })
    .catch(next);
});

/* GET job apply */
router.get('/:id/apply', (req, res, next) => {
  if (req.session.currentUser.role === 'employer') {
    const id = req.params.id;
    res.redirect('/jobs/' + id);
  }
  const jobId = req.params.id;
  Job.findById(jobId)
    .then((job) => {
      res.render('jobs/job-apply', {job});
    })
    .catch(next);
});

/* POST job apply */
router.post('/:id/apply', (req, res, next) => {
  const applicant = req.session.currentUser.name;
  const applicationText = req.body.application;
  const jobId = req.params.id;
  const updates = {
    $addToSet: {
      applications: {
        user: applicant,
        text: applicationText
      }
    }
  };

  Job.update({_id: jobId}, updates)
    .then((job) => {
      res.redirect('/jobs');
    })
    .catch(next);
});

router.post('/:id', (req, res, next) => {
  const jobId = req.params.id;

  const updates = {
    $set: {
      archive: true
    }
  };
  Job.update({_id: jobId}, updates)
    .then((job) => {
      res.redirect('/jobs');
    })
    .catch(next);
});

module.exports = router;
