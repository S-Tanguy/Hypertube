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

	// console.log(params)

	Movie.stream(title)
	.then(engine =>
	{
		Movie.download(engine, res);
	})
	.catch(err => res.status(401).json({sucess: false, message: 'sdsd'}))
})

	
router.post('/comment', (req, res, next) =>
{
	let {movie_id, post} = req.body,
		{login, picture} = req.user;

	if (post == undefined)
		return (res.status(401).json({sucess: false, err: "No comment posted"}));

	// console.log(req.user)
	Movie.postComment({movie_id, login, picture, post})
	.then(comment => res.json({sucess: true, message: 'Comment posted'}))
	.catch(err => res.status(401).json({sucess: false, message: 'Error while posting comment'}))
})
	
router.get('/comment', (req, res, next) =>
{
	let {movie_id} = req.query;

	if (movie_id == undefined)
		return (res.status(401).json({sucess: false, err: "Video id not provided not found"}));

	Movie.getComment(movie_id)
	.then(data => res.json({sucess: true, data}))
	.catch(err => res.status(401).json({sucess: false, message: 'Error while getting comment'}))
})

module.exports = router;
