var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/user', function(req, res, next) {
  res.json({ title: 'Express' });
});

module.exports = router;
