'USE STRICT'

const fetch = require('node-fetch'),
	api_key = 'c0116d807d6617f1817949aca31dd697',
	torrentSearchApi = require('torrent-search-api'),
	torrentStream = require('torrent-stream'),
	torrentSearch = new torrentSearchApi(),
 	transcoder = require('stream-transcoder'),
	srt2vtt = require('srt2vtt'),
 	fs = require('fs'),
 	https = require('https'),
	Movies = require('./movieSchema'),



	OS = require('opensubtitles-api'),
	opensubtitles = require("subtitler"),
	OpenSubtitles = new OS({
	  useragent:'TemporaryUserAgent',
	  username: 'aelharim',
	  password: 'password',
	  ssl: true
	});
	api_url = 'https://api.themoviedb.org/3';

torrentSearch.enableProvider('Torrent9');


function filterParams(params)
{
	let exeptedFields = ['api_key', 'with_genres', 'sort_by', 'vote_average.asc', 'sort_direction', 'primary_release_date.gte', 'primary_release_date.lte', 'vote_average.gte', 'vote_average.lte', 'language', 'page', 'query'],
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
			else if (params['query_type'] == 'single_video')
			{
				query_url += '/movie/' + params.id + '?';
				params = {language: params.language};
			}
			else
				reject('query_type not provided');

			params['api_key'] = api_key;
			query_url += filterParams(params)

			fetch(query_url)
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
				if (!torrents || !torrents[0])
					return reject("Torrent not found")

				torrentSearch.getMagnet(torrents[0])
				.then(magnet =>
				{
					var engine = torrentStream(magnet, {path:'./movies'});
					resolve(engine);
				})
				.catch(err => reject(err))
				
			})
			.catch(err => {console.log(err);reject(err)})
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

	subtitles: async function (params)
	{
	  opensubtitles.api.login()
	    .then(function(tok){
	        var token = tok;

	        // got the auth token
	              OpenSubtitles.search({
	                  imdbid: params.imdb_id
	              }).then(async subtitles => {
	            //    console.log(subtitles.fr);
	            //    console.log(subtitles.en);
	                if (subtitles.fr)
	                    await subtitles_fr(subtitles.fr.url, params.title);
	                if (subtitles.en)
	                    await subtitles_en(subtitles.en.url, params.title);
	              });
	    });
	},
	
	postComment: function (params)
	{
		return new Promise((resolve, reject) =>
		{
			let { movie_id, login, picture, post } = params;


			if (isNaN(movie_id))
				return (reject("Video not found"))

			Movies.findOne({ movie_id }, (err, movie)=>
			{
				if (err)
					return reject(err);

				if (!movie)
					movie = new Movies({ movie_id, message: [] });

				movie.message.push({user: {login, picture}, post})
				movie.save(function (err)
				{
					if (err)
						return (reject(err));

					return resolve("Message posted");
				})
				return (resolve("ok"))
			})
		})
	},
	
	getComment: function (movie_id)
	{
		return new Promise((resolve, reject) =>
		{
			if (!movie_id)
				return (reject("Video id not provided not found"))

			Movies.findOne({ movie_id }, (err, movie)=>
			{
				if (err)
					return reject(err);
				return (resolve(movie ? movie.message : []))
			})
		})
	}
};



function subtitles_fr(url, title){
  return new Promise((resolve, reject) => {
        var file =  fs.createWriteStream("./"+title+".fr.srt");
        var request = https.get(url, function(response) {
          response.pipe(file);
          file.on('finish', function(){
            convert_srtfr(title);
          })
        });
        if (request)
          resolve("./"+title+".fr.srt");
        else
          reject('dl_fr_fail');
  });
}

function convert_srtfr(title)
{
	var path = "./"+title+".fr.srt";
	var dest = "./"+title+".fr.vtt";

	const srtData = fs.readFileSync(path);
	srt2vtt(srtData, (err, vttData) =>
	{
		if (err)
			console.log("erreur conversion fr srt to vtt" + err)
		else
		{
			fs.writeFileSync(dest, vttData);
			fs.unlink(path, (err) =>
			{
				if (err)
					console.log("erreur 2 fr srt to vtt " + err)
			})
		}
	})
}


function subtitles_en(url, title)
{
	return new Promise((resolve, reject) =>
	{
        var file =  fs.createWriteStream("./"+title+".en.srt");
        var request = https.get(url, function(response)
        {
          response.pipe(file);
          file.on('finish', function()
          {
            convert_srten(title);
          })
        });

        if (request)
          resolve("./"+title+".en.srt");
        else
          reject('dl_en_fail');
	});
}

function convert_srten(title)
{
	var path = "./"+title+".en.srt";
	var dest = "./"+title+".en.vtt";
	const srtData = fs.readFileSync(path);

	srt2vtt(srtData, (err, vttData) =>
	{
		if (err)
			console.log("erreur conversion en srt to vtt" + err)
		else
		{
			fs.writeFileSync(dest, vttData);
			fs.unlink(path, (err) =>
			{
				if (err) console.log("erreur 2 en srt to vtt " + err)
			})
		}
	})
}
