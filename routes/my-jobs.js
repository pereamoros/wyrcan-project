var express = require('express');
var router = express.Router();

/* GET my-jobs page. */
router.get('/', (req, res, next) => {
  res.render('my-jobs/index');
});

router.post('/', (req, res, next) => {
  res.redirect('/jobs/create-job');
});

module.exports = router;
