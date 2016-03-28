var express = require('express');
var router = express.Router();

/* home page. Redirect to /tasks listing. */
router.get('/', function(req, res, next) {
  res.redirect('/tasks');
});

module.exports = router;
