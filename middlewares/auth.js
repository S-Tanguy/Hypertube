"STRICT MODE"

let bcrypt			= require('bcrypt-nodejs'),
	localStrategy	= require('passport-local').Strategy,
	GoogleStrategy	= require('passport-google-oauth20').Strategy,
	OAuth2Strategy = require('passport-oauth2'),
	Auth			= require('passport-auth0'),
	User 			= require('../models/user'),
	movie 			= require('../models/movie'),
	request = require('request'),
	saltRounds		= 10;



module.exports = function (passport)
{
		// =========================================================================
	  // passport session setup ==================================================
	  // =========================================================================
    passport.serializeUser(function(user, next)
    {
        next(null, user.id);
    });

    passport.deserializeUser(function(id, next)
    {
        User.findById(id, function(err, user) {
            next(err, user);
        });
    });



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	passport.use('local-signin', new localStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback

	},
	function(req, email, password, next)
	{
		User.findOne({'email': email}, function(err, user)
		{
			if (err)
				return next(err);

			if (!user)
				return next(null, false, {message: 'Incorrect email.' });

			if (!user.validPassword(password))
				return next(null, false, 'Oops! Wrong password.');

			return next(null, user);
		});
	}));

    // =========================================================================
    // LOCAL Register ==========================================================
    // =========================================================================
	passport.use('local-signup', new localStrategy(
	{
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'login',
		passwordField : 'password',
		passReqToCallback : true,
		session: false
	},
	function(req, email, password, next)
	{
		process.nextTick(function()
		{
			User.findOne({'email' :  email}, function(err, user)
			{
				if (err)
					return next(err);

				if (user)
					return next('The user already exist', false);

				let newUser	= new User(
				{
					given_name	: req.body.given_name,
					family_name	: req.body.family_name,
					login		: req.body.login,
					email		: req.body.email,
					provider	: "local",
					picture		: req.body.picture,
				});

				newUser.password = newUser.generateHash(password);
				
				// save the new user
				newUser.save(function(err)
				{
					if (err)
						return (next(err));

					console.log('User succefully create');
					return next(null, newUser);
				});
			});
		});
	}));

	passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google'
	},
		(accessToken, refreshToken, profile, next) =>
		{

			User.findOne({provider_user_id: profile.id, provider: 'google'}, (err, user) =>
			{
				if (err)
					return next(err, user);
				if (user)
					return next(null, user)

				let newUser,
					photo = (profile._json ? profile._json.image.url: profile.photos ? (profile.photos[0] ? profile.photos[0].value : null) : null),
					email = profile.emails ? profile.emails[0] ? profile.emails[0].value : null : null;


				newUser	= new User(
				{
					given_name			: profile.name.givenName,
					family_name			: profile.name.familyName,
					login				: profile.login,
					email				: email,
					picture				: photo,
					provider			: 'google',
					provider_user_id	: profile.id
				});

				newUser.save((err)=>
				{
					if (err)
						return next(err, user);

					return next(err, newUser);
				})

			});
		}
	));



	passport.use(new OAuth2Strategy({
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID:     process.env.CLIENT_ID_42,
			clientSecret: process.env.CLIENT_SECRET_42,
			callbackURL:  'http://localhost:3000/auth/42/callback'
		},
		function(accessToken, refreshToken, intraUser, next)
		{
			request.get('https://api.intra.42.fr/v2/me',
			{
				 headers: {  Authorization: ' Bearer ' + accessToken}
			},
			(err, httpResponse, profile) =>
			{
				profile = JSON.parse(profile);

				User.findOne({provider_user_id: profile.id, provider: '42'}, (err, user) =>
				{
					if (err)
						return next(err, user);
					if (user)
						return next(null, user)

						let newUser	= new User(
						{
							given_name				: profile.first_name,
							family_name				: profile.last_name,
							login							: profile.login,
							email							: profile.email,
							picture						: profile.image_url,
							provider					: '42',
							provider_user_id	: profile.id
						});

						newUser.save((err)=>
						{
							if (err)
								return next(err, user);

							return next(null, newUser);
						})
					})
			});
		}
	));


}
