var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/jobs');
  }
  // if (req.session.currentUser.role === 'student') {
  //   return res.redirect('/jobs');
  // }
  // if (req.session.currentUser.role === 'employer') {
  //   return res.redirect('/my-jobs');
  // }
  console.log(req.session.currentUser);
  res.render('index');
});

module.exports = router;
