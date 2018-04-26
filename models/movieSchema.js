'use strict'
let	mongoose		= require('mongoose'),
	bcrypt			= require('bcrypt-nodejs'),
	Schema			= mongoose.Schema,
	movieSchema;


// Schema
movieSchema			= new Schema(
{
	info:
	{
		thumbnail:
		{
			required: true,
			type : String
		},
		title:
		{
			required: true,
			type : String
		},
		url:
		{
			required: true,
			type : String
		},
		genre:
		{
			required: true,
			type : String,
			lowercase: true,
			trim: true
		},
		vote:
		{
			type : Number
		},
		author:
		{
			type : String,
			lowercase: true,
			trim: true
		},
		description:
		{
			type: String
		},
		creation_date:
		{
			type : Date
		}
	},

	message:
	[{
		user :
		{
			required: true,
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Users'
		},
		post:
		{
			required: true,
			trim: true,
			type : String
		}
	}],
});

module.exports = mongoose.model('Movie', movieSchema);
