'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Jobs = require('../models/jobs');

// -- Get jobs page

router.get('/', (req, res, next) => {
  res.redirect('/');
});

// -- Get create jobs

router.get('/create', (req, res, next) => {
  res.render('jobs/create-job');
});

module.exports = router;
