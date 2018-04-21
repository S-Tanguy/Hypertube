'use strict'

const nodemailer	= require('nodemailer'),
		crypto		= require('crypto'),
		passport	= require('passport'),
		User		= require('../Models/user'),
		jwt 		= require('../Middlewares/jwt.js'),
		customAuth 	= require('../Middlewares/customAuth.js'),
		userUtils	= require('../Utils/userDataValidator'),
		mailUtils	= require('../Utils/mail'),
		uploadUtils	= require('../Utils/upload'),
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

		res.json({succes: true, message: 'User authenticated successfuly'});

	})(req, res, next);
})


router.get('/42', passport.authenticate('oauth2'));

router.get('/42/callback', (req, res, next) =>
{

	passport.authenticate('oauth2', (err, user) =>
	{
		// Successful authentication, redirect home.
		console.log(user)
		next()
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
