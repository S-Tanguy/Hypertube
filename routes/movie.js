'use strict'

const jwt 		= require('../Middlewares/jwt.js'),
	Movie		= require('../models/movie'),
	router		= require('express').Router();








	/*	====================================
		============= movie CRUD ===========
		====================================  */

router.post('/', (req, res, next) =>
{
	res.json({message: 'Steam added'});
})




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



router.get('/findByPopularity', (req, res, next) =>
{
	let {page} = req.query,
		lang = req.user ? req.user.lang : null;

	console.log(page)
	if (!page || !lang)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	Movie.searchByPopularity(page, lang)
	.then(movies => res.json({sucess: true, movies: movies}))
	.catch(err => res.status(401).json({sucess: false, message: err}))
})




router.get('/:id', (req, res, next) =>
{
	let {id} = req.params,
		lang = req.user ? req.user.lang : null;

	if (id == undefined)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	Movie.get_description(id, lang)
	.then(movie => res.json({sucess: true, movie: movie}))
	.catch(err => res.status(401).json({sucess: false, message: err}))
})




router.get('/stream/:title', (req, res, next) =>
{
	let {title} = req.params,
		lang = req.user ? req.user.lang : null;

	if (title == undefined)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	Movie.stream(title, lang)
	.then(engine =>
	{
		Movie.download(engine, res);
	})
	.catch(err => res.status(401).json({sucess: false, message: 'sdsd'}))
})




router.put('/', (req, res, next)=>
{
	res.json({message: 'Steam updated'});
})




router.delete('/:id', (req, res, next) =>
{
	res.json({message: 'Steam deleted'});
})

module.exports = router;
