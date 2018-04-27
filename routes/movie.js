'use strict'

const jwt 		= require('../Middlewares/jwt.js'),
	Movie		= require('../models/movie'),
	router		= require('express').Router();








	/*	====================================
		============= movie CRUD ===========
		====================================  */

router.get('/find', (req, res, next) =>
{
	let params = req.query,
		lang = req.user ? req.user.lang : null;

	if (!params || !lang)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	params['language'] = lang;

	Movie.find(params, lang)
	.then(data => res.json({sucess: true, data: data}))
	.catch(err => res.status(401).json({sucess: false, message: err}))
})

router.get('/subtitles', (req, res, next) =>
{
	let params = req.query;

	if (!params)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	Movie.subtitles(params)
	.then(data => res.json({sucess: true, data: data}))
	.catch(err => res.status(401).json({sucess: false, message: err}))
})


router.get('/stream/:title', (req, res, next) =>
{
	let {title} = req.params;

	if (title == undefined)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	Movie.stream(title)
	.then(engine =>
	{
		Movie.download(engine, res);
	})
	.catch(err => res.status(401).json({sucess: false, message: 'sdsd'}))
})

module.exports = router;
