'use strict';

const requireUser = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};
const requireNoUser = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};
const requireEmployer = (req, res, next) => {
  requireUser(req, res, () => {
    if (req.session.currentUser.role !== 'employer') {
      return res.redirect('/jobs');
    }
    next();
  });
};
const requireStudent = (req, res, next) => {
  requireUser(req, res, () => {
    if (req.session.currentUser.role !== 'student') {
      return res.redirect('/my-jobs');
    }
    next();
  });
};

module.exports = {
  requireUser,
  requireNoUser,
  requireEmployer,
  requireStudent
};
