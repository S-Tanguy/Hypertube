'use strict'

module.exports =
{
	tokenazableUser: (movie)=>
	{
		if (movie)
			delete movie.provider_user_id;

		return (movie);
	}
}
