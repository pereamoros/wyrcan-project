'use strict';

const requireUser = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};
const requireNoUser = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};
const requireEmployer = (req, res, next) => {
  requireNoUser(req, res, next);
  if (req.session.currentUser.role !== 'employer') {
    return res.redirect('/jobs');
  }
  next();
};
const requireStudent = (req, res, next) => {
  requireNoUser(req, res, next);
  if (req.session.currentUser.role !== 'student') {
    return res.redirect('/my-jobs');
  }
  next();
};
const requireStudentJob = (req, res, next) => {
  requireNoUser(req, res, next);
  if (req.session.currentUser.role !== 'student') {
    const id = req.params.id;
    return res.redirect('/jobs/' + id);
  }
  next();
};
const requireEmployerJob = (req, res, next) => {
  requireNoUser(req, res, next);
  if (req.session.currentUser.role !== 'employer') {
    const id = req.params.id;
    return res.redirect('/jobs/' + id + '/apply');
  }
  next();
};

module.exports = {
  requireUser,
  requireNoUser,
  requireEmployer,
  requireStudent,
  requireStudentJob,
  requireEmployerJob
};
