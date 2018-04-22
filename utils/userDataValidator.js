'use strict'

module.exports =
{
	tokenazableUser: (user)=>
	{
		if (user)
			delete user.provider_user_id;

		return (user);
	}
}
