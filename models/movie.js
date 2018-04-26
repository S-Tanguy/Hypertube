'USE STRICT'

const fetch = require('node-fetch'),
	api_key = 'c0116d807d6617f1817949aca31dd697',
	torrentSearchApi = require('torrent-search-api'),
	torrentStream = require('torrent-stream'),
	torrentSearch = new torrentSearchApi(),
	api_url = 'https://api.themoviedb.org/3';

torrentSearch.enableProvider('Torrent9');



module.exports =
{
	findByName: (name, userLang) =>
	{
		return new Promise((resolve, reject) =>
		{
			fetch(`${api_url}/search/movie?api_key=${api_key}&query=${name}&language=${userLang}`)
			.then(res=> resolve(res.json()))
			.catch(err => reject(err))
		})
	},

	get_description: (id, userLang) =>
	{
		return new Promise((resolve, reject) =>
		{
			fetch(`${api_url}/movie/${id}?api_key=${api_key}&language=${userLang}`)
			.then(res=> resolve(res.json()))
			.catch(err => reject(err))
		})
	},

	stream: (title) =>
	{
		return new Promise((resolve, reject) =>
		{
			torrentSearch.search(['IpTorrents', 'Torrent9'], title, 'Movies', 20)
			.then(torrents =>
			{
				// resolve(torrents[0]);
				torrentSearch.getMagnet(torrents[0])
				.then(magnet =>
				{
					var engine = torrentStream(magnet, {path:'./movies'});
					resolve(engine);
				})
				.catch(err => reject(err))
				
			})
			.catch(err => reject(err))
		})
	},

	findByLoginOrEmail: (login, email) =>
	{
		return new Promise((resolve, reject) =>
		{
			if (false)
				return (reject('error'));

			return (resolve('ok'))
		})
	},

	add: (new_user) =>
	{
		return new Promise((resolve, reject) =>
		{
			if (false)
				return (reject('error'));

			return (resolve('ok'))
		})
	},

	update: (new_user) =>
	{
		return new Promise((resolve, reject) =>
		{
			if (false)
				return (reject('error'));

			return (resolve('ok'))
		})
	},

	delete: (id) =>
	{
		return new Promise((resolve, reject) =>
		{
			if (false)
				return (reject('error'));

			return (resolve('ok'))
		})
	},
};