var express = require('express');
var router = express.Router();
// let database = require('./../model/index');


/* GET users listing. */
router.get('/', function(req, res, next)
{

	// let friends = database.userFriends(req.params.id)

	res.json({succes: true, users: ['test', 'tata']});
  // res.send('respond with a resource');
});

module.exports = router;
