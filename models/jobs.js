'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  position: String,
  description: String,
  owner: String,
  archive: Boolean,
  applications: [{
    user: String,
    text: String
  }]
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
