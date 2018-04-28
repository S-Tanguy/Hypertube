'USE STRICT'

const fetch = require('node-fetch'),
	api_key = 'c0116d807d6617f1817949aca31dd697',
	torrentSearchApi = require('torrent-search-api'),
	torrentStream = require('torrent-stream'),
	torrentSearch = new torrentSearchApi(),
 	transcoder = require('stream-transcoder'),

	api_url = 'https://api.themoviedb.org/3';

torrentSearch.enableProvider('Torrent9');


function filterParams(params)
{
	let exeptedFields = ['with_genres', 'sort_by', 'sort_direction', 'primary_release_date.gte', 'primary_release_date.lte', 'vote_average.gte', 'vote_average.lte', 'language', 'page', 'api_key', 'query'],
		r = '',
		key;

	for (key in  params)
		if (exeptedFields.indexOf(key) > -1)
			if (params[key])
				r += key + '=' + params[key] + '&';
	return  (r.length > 0) ? r.substring(0, r.length - 1) : r;
}


module.exports =
{
	find: (params) =>
	{
		return new Promise((resolve, reject) =>
		{
			let query_url = api_url;

			if (params['query_type'] == 'search')
				query_url += '/search/movie?';
			else if (params['query_type'] == 'discover')
				query_url += '/discover/movie?'
			else if (params['query_type'] == 'genre')
				query_url += '/genre/movie/list?'
			else
				reject('query_type not provided');

			params['api_key'] = api_key;
			query_url += filterParams(params)

			fetch(query_url)
			.then(res=> resolve(res.json()))
			.catch(err => reject(err))
		})
	},

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

	download: (engine, res) =>
	{
		return new Promise((resolve, reject) =>
		{
			engine.on('ready', function()
			{
				engine.files.forEach(async function(file)
				{
					if (file.name.indexOf('.avi') !== -1 || file.name.indexOf('.flv') !== -1 || file.name.indexOf('.mkv') !== -1)
					{
						const fileSize  = await file.length
						const stream = await file.createReadStream()

						const head = await
						{
							'Content-Length': fileSize,
							'Content-Type': 'video/mp4',
						}

						var toto = await new transcoder(stream)
							.videoCodec('h264')
							.videoBitrate(800 * 1000)
							.fps(25)
							.audioCodec('aac')
							.sampleRate(44100)
							.channels(2)
							.audioBitrate(128 * 1000)
							.format('mp4')
							.on('finish', function()
							{
								next();
							})
							.stream(stream).pipe(res);

						res.writeHead(200, head)

					}

					if (file.name.indexOf('.mp4') !== -1)
					{
						const fileSize  = await file.length
						if (range)
						{
							const parts = await range.replace(/bytes=/, "").split("-")
							const start = await parseInt(parts[0], 10)
							const end = await parts[1]
							? parseInt(parts[1], 10)
							: fileSize-1

							const chunksize = await (end-start)+1
							const stream = await file.createReadStream({start, end})
							const head = await
							{
							'Content-Range': `bytes ${start}-${end}/${fileSize}`,
							'Accept-Ranges': 'bytes',
							'Content-Length': chunksize,
							'Content-Type': 'video/mp4',
							}

							res.writeHead(206, head)
							stream.pipe(res)
						}
						else
						{
							const head = await
							{
								'Content-Length': fileSize,
								'Content-Type': 'video/mp4',
							}
							res.writeHead(200, head)
							var toto = await file.createReadStream()
							toto.pipe(res)
						}
					}
		  		});
			})
		})
	},

	searchByPopularity: (page, userLang) =>
	{
		return new Promise(function(resolve, reject)
		{
			fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=c0116d807d6617f1817949aca31dd697&primary_release_date.gte=1970&language=' + userLang + '&page=' + page)
			.then(res => res.json())
			.then(json => {
			resolve(json);
			});
		});
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