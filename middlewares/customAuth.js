'USE STRICT'

let	request		= require('request');


module.exports =
{
	auth42: (params, cb)=>
	{
		const oauth =
		{
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			clientID: process.env.CLIENT_ID_42,
			clientSecret: process.env.CLIENT_SECRET_42,
			callbackURL: "http://localhost:3000/auth/42"
		},
		url = 'https://api.intra.42.fr/oauth/token';


		return request.post({url:url, oauth:oauth}, cb);
		// return request.post('https://api.intra.42.fr/oauth/token', data, cb);
	}
}
