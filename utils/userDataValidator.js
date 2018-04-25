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
		let fields = ['given_name', 'family_name', 'login', 'password', 'email', 'picture', 'lang'],
		r = {}, 
		len = fields.length;

		for (var i = len - 1; i >= 0; i--)
			if (data.hasOwnProperty(fields[i]))
				r[fields[i]] = data[fields[i]]
		return (r);
	},
}
