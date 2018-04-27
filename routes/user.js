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

	console.log(login)
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

		data = userUtils.updatableData(req.body);

		for (key in data)
			if (data.hasOwnProperty(key))
				user[key]  = (key != 'password') ? data[key] : bcrypt.hashSync(new_user.password, bcrypt.genSaltSync(8));

		user.save((err)=>
		{
			if (err)
				res.status(401).json({sucess: false, err });

			User.findOne({email: user.email})
			.then((newUser)=>
			{
				console.log(newUser)
				// console.log('///////////')
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

		let reset_key = crypto.randomBytes(25).toString('hex'),
			params = {to: user.email};


		mailUtils.reset_pass(reset_key, params)
		.then(res=>
		{
		    user.password = user.generateHash(req.password);
		    user.reset_pass = reset_pass;
				console.log('chien');
		    user.save((err)=>
		    {
		    	if (err)
						return (res.status(401).json({sucess: false, message: 'User no found error 1'}));

				res.json({sucess: true, message: 'User password update successfuly.'});
		    })
		})
		.catch(err=> res.status(401).json({sucess: false, err, toto: "flute"}))


	})
})

module.exports = router;
