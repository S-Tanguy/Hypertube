'use strict'

const nodemailer	= require('nodemailer'),
		crypto		= require('crypto'),
		passport	= require('passport'),
		User		= require('../models/userSchema'),
		jwt 		= require('../middlewares/jwt.js'),
		userUtils	= require('../utils/userDataValidator'),
		mailUtils	= require('../utils/mail'),
		uploadUtils	= require('../utils/upload'),
		router		= require('express').Router(),
		bcrypt		= require('bcrypt-nodejs'),
		url			= require('url');



/*	====================================
	SIGN IN ============================
	====================================  */

// local
router.post('/signin', (req, res, next) =>
{
	console.log(2)

	passport.authenticate('local-signin', (err, user, errMessage)=>
	{
		if (err || errMessage)
			return (res.status(401).json({sucess: false, errMessage}));

		let new_user = userUtils.tokenazableUser(user),
			token = jwt.generateToken(new_user);

		res.json({
			sucess: true,
			user: new_user,
			token: token
		})
	})(req, res, next);
})
.post('/signup', (req, res, next) =>
{
	passport.authenticate('local-signup', (err, user, errMessage) =>
	{

		if (err || errMessage)
			return (res.status(401).json({sucess: false, err, errMessage}));

		let new_user = userUtils.tokenazableUser(user),
		token = jwt.generateToken(new_user);

		res.json({
			sucess: true,
			user: new_user,
			token: token
		})
	})(req, res, next);
})

// google
router.get('/google', (req, res, next) =>
{

	passport.authenticate('google', {scope: ['profile', 'email']}, (err, user)=>
	{
		if (err)
			return (res.status(401).json({sucess: false, err}));

			let new_user = userUtils.tokenazableUser(user),
				token = jwt.generateToken(new_user);

			res.redirect(url.format({
				pathname:"http://localhost:4200",
				query: {token, sucess: true}
			}))
			// res.json({
			// 	sucess: true,
			// 	user: new_user,
			// 	token: token
			// })

	})(req, res, next);
})


// 42
router.get('/42', passport.authenticate('oauth2'));

router.get('/42/callback', (req, res, next) =>
{

	passport.authenticate('oauth2', (err, user) =>
	{
		if (err)
			return (res.status(401).json({sucess: false, err}));

		let new_user = userUtils.tokenazableUser(user),
			token = jwt.generateToken(new_user);

		res.redirect(url.format({
			pathname:"http://localhost:4200",
			query: {token, sucess: true}
		}))
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
