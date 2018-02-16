'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  role: String,
  appliedJobs: [{
    type: ObjectId,
    ref: 'Job'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
