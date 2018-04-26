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
.get('/find', (req, res, next) =>
{
	let {name} = req.query,
		lang = req.user ? req.user.lang : null;

	console.log(name)
	if (!name || !lang)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	Movie.findByName(name, lang)
	.then(movies => res.json({sucess: true, movies: movies}))
	.catch(err => res.status(401).json({sucess: false, message: err}))
})
.get('/:id', (req, res, next) =>
{
	let {id} = req.params,
		lang = req.user ? req.user.lang : null;

	if (id == undefined)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	Movie.get_description(id, lang)
	.then(movie => res.json({sucess: true, movie: movie}))
	.catch(err => res.status(401).json({sucess: false, message: err}))
})
.get('/stream/:title', (req, res, next) =>
{
	let {title} = req.params,
		lang = req.user ? req.user.lang : null;

	if (title == undefined)
		return (res.status(401).json({sucess: false, err: "Movie not found"}));

	title = "Roi Lion 1991";

	Movie.stream(title, lang)
	.then(engine =>
	{
		console.log(engine)
	})
	.catch(err => res.status(401).json({sucess: false, message: err}))
})
.put('/', (req, res, next)=>
{
	res.json({message: 'Steam updated'});
})
.delete('/:id', (req, res, next) =>
{
	res.json({message: 'Steam deleted'});
})

module.exports = router;
