'use strict'

const nodemailer	= require('nodemailer'),
		crypto		= require('crypto'),
		User		= require('../models/user'),
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
.get('/:id', (req, res, next) =>
{
		User.findById(req.params.id, con).then((user)=>
		{
				return (res.json({sucess: true, user: user}));
		})
		.catch((err)=>
		{
				return (res.status(401).json({sucess: false, message: err}));

		})
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

router.post('/send_password_reset_mail', (req, res) =>
{

	mailUtils.reset_pass()
	.then(res=> console.log(res))
	.catch(err=> {throw err})
	res.json({message: 'An email has been sent to you with an link.\nplease follow the link inside it.'});

	return (false);


	User.findOne({email: req.body.email}, (err, user)=>
	{
		if (err)
			throw err;
		if (!user)
			return (res.status(401).json({sucess: false, message: 'User no found'}));

		const transport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
			    user: process.env.MAIL_ADDRR,
			    pass: process.env.MAIL_PASS
			}
		}),
		reset_key = crypto.randomBytes(25).toString('hex');

		transport.sendMail({
		    from: "kacoulib ✔ <kaoculib@student.42.fr>", // sender address
		    to: "coulibaly91karim@gmail.com", // list of receivers
		    subject: "Matcha password reset", // Subject line
		    html: "<b><a href='http://localhost:3001/pass_reset/"+ reset_key +"'>Link ✔</a></b>" // html body
		}, function(err, response)
		{
		    if(err)
		        throw err;

		        console.log("Message sent: " + response.message);


		    user.reset_pass = reset_key;
		    user.save((err)=>
		    {
		    	if (err)
		    		throw err;

				res.json({message: 'An email has been sent to you with an link.\nplease follow the link inside it.'});
		    })
		    transport.close();
		});
	})
})

router.post('/reset_pass', (req, res) =>
{
	console.log('ok')
	if (!req.body.reset_pass)
		return (res.status(401).json({sucess: false, message: 'User no found'}));

	User.findOne({reset_pass: req.body.reset_pass}, (err, user)=>
	{
		if (err)
			throw err;
		if (!user)
			return (res.status(401).json({sucess: false, message: 'User no found'}));

	    user.password = user.generateHash(req.password);
	    user.reset_pass = null;
	    user.save((err)=>
	    {
	    	if (err)
	    		throw err;

			res.json({sucess: true, message: 'User password update successfuly.'});
	    })
	})
})

module.exports = router;
