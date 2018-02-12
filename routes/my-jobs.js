var express = require('express');
var router = express.Router();

/* GET my-jobs page. */
router.get('/', (req, res, next) => {
  res.render('my-jobs/index');
});

module.exports = router;
