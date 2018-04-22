const express		= require('express'),
	path			= require('path'),
	cookieParser	= require('cookie-parser'),
	logger			= require('morgan'),
	indexRouter 	= require('./routes/index'),
	passport		= require('passport'),
	userRouter		= require('./routes/user'),
	authRouter		= require('./routes/auth'),
	jwtMiddlware		= require('./middlewares/jwt'),
	mongoose		= require('mongoose'),
	database		= require('./models/database.js'),
	app				= express();



// db connection ===============================================================

mongoose.connect(database.url, (err)=>
{
	if (err)
		throw  err;

	// configuration ===============================================================
	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));

	app.use((req, res,next)=>
	{
		res.setHeader('Access-Control-Allow-Origin',  'http://localhost:4200');
		res.header('Access-Control-Allow-Credentials', true);
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		next();
	});

	// passport
	app.use(passport.initialize());
	app.use(passport.session());
	require('./middlewares/auth.js')(passport),

	// jwt
	app.use(jwtMiddlware.deserialize);


	// Controllers ===============================================================
	app.use('/', indexRouter);
	app.use('/user', userRouter);
	app.use('/auth', authRouter);

})






module.exports = app;
