'use strict'

module.exports =
{
	tokenazableUser: (user)=>
	{
		if (user)
			delete user.provider_user_id;

		return (user);
	},

	updatableData: (data)=>
	{
		let fields = ['given_name', 'family_name', 'login', 'password', 'email', 'picture', 'lang', 'viewd_movies'],
		r = {}, 
		len = fields.length;

		for (var i = len - 1; i >= 0; i--)
			if (data.hasOwnProperty(fields[i]))
				r[fields[i]] = data[fields[i]]
		return (r);
	},

	generateLoginFromName: (first_name, last_name) =>
	{
		if (!first_name || !last_name)
			return false;

		return (first_name.slice(0, 2)+last_name.slice(0, last_name.length));
	}
}
