const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');

/* GET my-jobs page. */
router.get('/', (req, res, next) => {
  if (req.session.currentUser.role === 'student') {
    res.redirect('jobs');
  }
  Job.find({owner: req.session.currentUser._id})
    .then((jobs) => {
      res.render('my-jobs/index', {jobs});
    })
    .catch();
});

router.post('/', (req, res, next) => {
  res.redirect('/jobs/create-job');
});

module.exports = router;
