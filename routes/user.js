'use strict'

const nodemailer	= require('nodemailer'),
		crypto		= require('crypto'),
		User		= require('../models/userSchema'),
		jwt 		= require('../middlewares/jwt.js'),
		// customAuth 	= require('../Middlewares/customAuth.js'),
		userUtils	= require('../utils/userDataValidator'),
		mailUtils	= require('../utils/mail'),
		uploadUtils	= require('../utils/upload'),
		router		= require('express').Router(),

		bcrypt		= require('bcrypt-nodejs');






/*	====================================
	============= USER CRUD ============
	====================================  */


router.post('/', (req, res, next) =>
{
		passport.authenticate('local-signup', (err, user, errMessage) =>
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
.get('/:login', (req, res, next) =>
{
	let login  = req.params.login;

	if (!login)
		return (res.status(401).json({sucess: false, message: 'User not found'}));
		
	User.findOne({login})
	.then((user)=>res.json({sucess: true, user: user}))
	.catch((err)=>res.status(401).json({sucess: false, message: err}))

})

.put('/', (req, res, next)=>
{
	let findUser,
		key,
		data,
		token,
		updateUser = {};

	if (req.user.provider == 'local')
		findUser = {login: req.user.login};
	else
		findUser = {email: req.user.email};


	User.findOne(findUser)
	.then((user)=>
	{
		// console.log(user)
		
		data = userUtils.updatableData(req.body);

		for (key in data)
		{
			if (data.hasOwnProperty(key))
			{
				if (key == 'password')
					user[key] = user.generateHash(data[key]);
				else if (key == 'viewd_movies')
				{
					if (!user.viewd_movies)
						user.viewd_movies = [data[key]];
					else if (!user.viewd_movies.includes(data[key]))
						user.viewd_movies.push(data[key]);
				}
				else
					user[key] = data[key];
			}
				console.log(key)
		}


		user.save((err)=>
		{
			if (err)
				res.status(401).json({sucess: false, err });

			User.findOne({email: user.email})
			.then((newUser)=>
			{
				newUser = userUtils.tokenazableUser(newUser);
				let token = jwt.generateToken(newUser);

				res.json({sucess: true, message: 'User updated', token})
			})
			.catch((err)=>(res.status(401).json({sucess: false, err })))
		})
	})
	.catch((user)=>(res.status(401).json({sucess: false, message: 'User not found.' })))
})

.delete('/user/:id', (req, res, next) =>
{
	let id  = req.params.id;

	User.delete(id, con).then((user)=>
	{
			return (res.json({sucess: true, message: `User ${id} deteled`}));
	})
	.catch((err)=>
	{
			return (res.status(401).json({sucess: false, message: err}));
	})
})







	/*	====================================
		============= EMAIL ================
		====================================  */


router.post('/reset_pass', (req, res) =>
{
	
	User.findOne({email: req.body.email, provider: 'local'}, (err, user)=>
	{
		if (err)
			return (res.status(401).json({sucess: false, message: 'User no found error 1'}));
		if (!user)
			return (res.status(401).json({sucess: false, message: 'User no found'}));

		user.reset_pass = crypto.randomBytes(15).toString('hex');

		mailUtils.reset_pass({to: user['email'], reset_pass: user['reset_pass']})
		.then(msg =>
		{
			user.save((err) =>
			{
				if (err)
					return (res.status(401).json({sucess: false, err}));

				res.json({sucess: true, message: 'Mail send.'});
			})
		})
		.catch(err => res.status(401).json({sucess: false, err}))


	})
})

module.exports = router;
