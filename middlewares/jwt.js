'use strict'

let jwt		= require('jsonwebtoken'),
	dotenv	= require('dotenv').config(),
	userUtils	= require('../utils/userDataValidator');


module.exports =
{
	generateToken: (user)=>
	{
		user  = userUtils.tokenazableUser(user);

		return (jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '24h'}));
	},

	verify: (token, calb)=>
	{
		jwt.verify(token, process.env.JWT_SECRET, calb)
	},

	deserialize: (req, res, next) =>
	{
	   // check header or url parameters or post parameters for token
	   var token = req.headers['authorization'],
		 		not_loged_user_acess_page = ['/auth'];

		 if (not_loged_user_acess_page.indexOf(req.originalUrl) > -1)
			 return next();

		 if (!token)
		 	return next(); //if no token, continue

		 token = token.replace('Bearer ', '');

	   jwt.verify(token, process.env.JWT_SECRET, function(err, user)
		 {
	     if (err) {
	       return res.status(401).json({
	         success: false,
	         message: 'Invalid token provided'
	       });
	     } else {
	       req.user = user; //set the user to req so other routes can use it
	       next();
	     }
	   });
	}
}
