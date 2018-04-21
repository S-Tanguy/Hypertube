'USE STRICT'

let	request		= require('request');


module.exports =
{
	auth42: (code, cb)=>
	{

		request.post(
        'https://api.intra.42.fr/oauth/token', {
            form: {
                grant_type: 'authorization_code',
				client_id: process.env.CLIENT_ID_42,
				client_secret: process.env.CLIENT_SECRET_42,
                code: code,
                redirect_uri: 'http://localhost:3000/auth/42'
            }
        }, (e, r, data) => {

        	console.log('e = ', e)
        	console.log('r = ', r)
        	console.log('data = ', data)
        })
		// const oauth =
		//  {

		// 	client_id: process.env.CLIENT_ID_42,
		// 	client_secret: process.env.CLIENT_SECRET_42,
	 //        grant_type: 'authorization_code',
		// 	redirect_uri: "http://localhost:3000/auth/42"

		// };

		// if (code)
		// 	url = 'https://api.intra.42.fr/oauth/token';
		// else
		// 	url = 'https://api.intra.42.fr/oauth/authorize';


		// console.log('est')
		// return request.post({
  //           url: 'https://api.intra.42.fr/oauth/token',
  //           qs: oauth
  //       }, (err, response, body)=>
		// {
		// 	// console.log(err)
		// 	// console.log(response)
		// 	// console.log(body)
		// 	console.log(response.request.uri)
		// });
		// return request.post('https://api.intra.42.fr/oauth/token', data, cb);
	}
}
