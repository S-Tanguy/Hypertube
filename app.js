var express = require('express');
	path = require('path');
	cookieParser = require('cookie-parser');
	logger = require('morgan');
	indexRouter = require('./routes/index');
	usersRouter = require('./routes/users');
	logger = require('morgan');
	app = express();




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





// Controllers ===============================================================
app.use('/', indexRouter);
app.use('/users', usersRouter);




module.exports = app;
