const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');

/* GET my-jobs page. */
router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  Job.find({$and: [{owner: req.session.currentUser._id}, {archive: false}]})
    .then((jobs) => {
      res.render('my-jobs/index', {jobs});
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  res.redirect('/jobs/create-job');
});

router.get('/archive', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  Job.find({archive: true})
    .then((jobs) => {
      res.render('jobs/archive', {jobs});
    })
    .catch(next);
});

router.post('/:id/unarchive', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  const jobId = req.params.id;

  const updates = {
    $set: {
      archive: false
    }
  };
  Job.update({_id: jobId}, updates)
    .then((job) => {
      res.redirect('/my-jobs');
    })
    .catch(next);
});

module.exports = router;
