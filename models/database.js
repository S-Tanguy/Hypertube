'use strict'

const dotenv	= require('dotenv').config();

module.exports	=
{
	url : 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@ds151169.mlab.com:51169/42hypertube'
}
