'USE STRICT'

const fetch = require('node-fetch'),
	api_key = 'c0116d807d6617f1817949aca31dd697',
	torrentSearchApi = require('torrent-search-api'),
	torrentStream = require('torrent-stream'),
	torrentSearch = new torrentSearchApi(),
 	transcoder = require('stream-transcoder'),

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
					// console.log('///////13')
					var engine = torrentStream(magnet, {path:'./movies'});
					resolve(engine);
				})
				.catch(err => {console.log('----------');reject(err)})
				
			})
			.catch(err => {console.log('************');reject(err)})
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
						console.log(file.length + "\n")
						console.log(file.name + "\n")
						if (range)
						{
							console.log('toto');
							const parts = await range.replace(/bytes=/, "").split("-")
							const start = await parseInt(parts[0], 10)
							const end = await parts[1]
							? parseInt(parts[1], 10)
							: fileSize-1
							console.log(end + " ICI");

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
							console.log('toto2' + "\n");
						}
						else
						{
							console.log('flute' + "\n");
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