'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const jobSchema = new Schema({
  position: String,
  description: String,
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  archive: Boolean,
  applications: [{
    user: {
      type: ObjectId,
      ref: 'User'
    },
    text: String
  }],
  successCandidate: {
    type: ObjectId,
    ref: 'User'
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
