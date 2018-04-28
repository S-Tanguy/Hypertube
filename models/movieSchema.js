'use strict'
let	mongoose		= require('mongoose'),
	bcrypt			= require('bcrypt-nodejs'),
	Schema			= mongoose.Schema,
	movieSchema;


// Schema
movieSchema			= new Schema(
{
	movie_id:
	{
		required: true,
		type : Number
	},

	message:
	[{
		user :
		{
			login:
			{
				required: true,
				type: String,
				lowercase: true,
				trim: true,
				validate: (str) => str.length > 2 && str.indexOf('$') < 0
			},
			picture:
			{
				type : String
			}
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
