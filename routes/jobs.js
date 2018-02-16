'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Job = require('../models/jobs');
const mongoose = require('mongoose');
// const auth = require('../helpers/authorization');

/* GET jobs */
router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'student') {
    return res.redirect('/my-jobs');
  }
  Job.find({archive: false})
    .then((jobs) => {
      res.render('jobs/index', {jobs});
    })
    .catch(next);
});

/* GET create jobs */
router.get('/create-job', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  res.render('jobs/create-job');
});

/* POST create jobs */
router.post('/create-job', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  const position = req.body.position;
  const description = req.body.description;
  const salary = req.body.salary;

  if (position === '' || description === '') {
    const data = {
      message: 'All fields are required'
    };
    return res.render('jobs/create-job', data);
  }
  const newJob = new Job({
    position,
    description,
    salary,
    owner: req.session.currentUser._id,
    archive: false,
    successCandidate: null
  });

  newJob.save()
    .then((response) => {
      res.redirect('/my-jobs');
    })
    .catch(next);
});

/* GET job id */
router.get('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    const id = req.params.id;
    return res.redirect('/jobs/' + id + '/apply');
  }
  const jobId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).render('not-found');
  }
  Job.findById(jobId)
    .populate('applications.user')
    .populate('successCandidate')
    .then((job) => {
      if (!job) {
        return res.status(404).render('not-found');
      }
      res.render('jobs/job-id', {job});
    })
    .catch(next);
});

// -- * Edit Job * -- //

router.get('/:id/edit', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  const jobId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).render('not-found');
  }
  Job.findById(jobId)
    .then((job) => {
      if (!job) {
        return res.status(404).render('not-found');
      }
      res.render('jobs/edit-job', {job});
    })
    .catch(next);
});

router.post('/:id/edit', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  const jobId = req.params.id;
  const position = req.body.position;
  const description = req.body.description;
  const salary = req.body.salary;

  const updateJob = {
    $set: {
      position,
      description,
      salary
    }
  };

  Job.update({_id: jobId}, updateJob)
    .then((job) => {
      res.redirect('/jobs/' + jobId);
    })
    .catch(next);
});

/* GET job apply */
router.get('/:id/apply', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'student') {
    const id = req.params.id;
    return res.redirect('/jobs/' + id);
  }
  const jobId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).render('not-found');
  }
  Job.findById(jobId)
    .populate('owner')
    .then((job) => {
      if (!job) {
        return res.status(404).render('not-found');
      }
      res.render('jobs/job-apply', {job});
    })
    .catch(next);
});

/* POST job apply */
router.post('/:id/apply', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'student') {
    return res.redirect('/my-jobs');
  }
  const applicant = req.session.currentUser._id;
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

  const updateApply = {
    $addToSet: {
      appliedJobs: jobId
    }
  };

  User.update({_id: applicant}, updateApply)
    .then((user) => {
      Job.update({_id: jobId}, updates)
        .then((job) => {
          res.redirect('/jobs');
        })
        .catch(next);
    })
    .catch(next);

  // let appId;

  // Job.find(applications).forEach(application => {
  //   if (application.user === req.session.currentUser._id) {
  //     appId = application.id;
  //     console.log(appId);
  //   }
  // });

  // Job.findByIdAndUpdate(jobId)
  //   .then((response) => {
  //     Job.update({_id: jobId}, updates)
  //       .then((job) => {
  //         res.redirect('/jobs');
  //       });
  //   })
  //   .then((response) => {
  //     Job.update({_id: jobId}, updates)
  //       .then((job) => {
  //         res.redirect('/jobs');
  //       });
  //   })
  //   .catch(next);
});

router.post('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
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

router.post('/:idjob/:iduser/approve', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }

  const applicant = req.params.iduser;
  const jobId = req.params.idjob;
  const updates = {
    $set: {
      successCandidate: applicant
    }
  };
  Job.update({_id: jobId}, updates)
    .then((job) => {
      res.redirect('/jobs/' + jobId);
    })
    .catch(next);
});

module.exports = router;
