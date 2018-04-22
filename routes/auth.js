'use strict'

const nodemailer	= require('nodemailer'),
		crypto		= require('crypto'),
		passport	= require('passport'),
		User		= require('../models/user'),
		jwt 		= require('../middlewares/jwt.js'),
		customAuth 	= require('../middlewares/customAuth.js'),
		userUtils	= require('../utils/userDataValidator'),
		mailUtils	= require('../utils/mail'),
		uploadUtils	= require('../utils/upload'),
		router			= require('express').Router(),
		bcrypt		= require('bcrypt-nodejs');



/*	====================================
	SIGN IN ============================
	====================================  */


router.post('/sign_in', (req, res, next) =>
{

	passport.authenticate('local-signin', (err, user, errMessage)=>
	{
		if (err)
			return (res.status(401).json({sucess: false, err}));

		let new_user = userUtils.cleanNewUser(user),
			token = jwt.generateToken(new_user);

		res.json({
			sucess: true,
			user: new_user,
			token: token
		})
	})(req, res, next);
})

.get('/google', (req, res, next) =>
{

	passport.authenticate('google', {scope: ['profile', 'email']}, (err, user)=>
	{
		if (err)
			return (res.status(401).json({sucess: false, err}));

			let new_user = userUtils.tokenazableUser(user),
				token = jwt.generateToken(new_user);

			res.json({
				sucess: true,
				user: new_user,
				token: token
			})

	})(req, res, next);
})


router.get('/42', passport.authenticate('oauth2'));

router.get('/42/callback', (req, res, next) =>
{

	passport.authenticate('oauth2', (err, user) =>
	{
		if (err)
			return (res.status(401).json({sucess: false, err}));

		let new_user = userUtils.tokenazableUser(user),
			token = jwt.generateToken(new_user);

		res.json({
			sucess: true,
			user: new_user,
			token: token
		})
	})(req, res, next);
});


/*	====================================
		SIGN out ===========================
	====================================  */


router.get('/logout', function(req, res, next)
{
	next()
});

module.exports = router;
