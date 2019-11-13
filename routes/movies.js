const express = require('express');
const { Movie, validateMovie } = require('../models/movies');
const { Genre } = require('./../models/genres');
const dbDebugger = require('debug')('app:db');

const router = express.Router();


router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const requestedMovieID = req.params.id;

    try {
        const movie = await Movie.findById(requestedMovieID);

        if (!movie) return res.send('No such movie found');

        res.send(movie);
    } catch (exception) {
        res.send(exception.message);
    }

});

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre');

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    try {
        movie = await movie.save();
        res.send(movie);
    } catch (exception) {
        res.send(exception.message);
        dbDebugger(exception);
    }


});

router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id,
            {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }, { new: true });
        if (!movie) return res.status(404).send('No such movie found');
        res.send(movie);
    } catch (exception) {
        return res.status(400).send(exception.message);
    }
});

router.delete('/:id', async (req, res) => {
    const requestedmovieID = req.params.id;

    try {
        const movie = await Movie.findByIdAndDelete(requestedmovieID);
        if (!movie) return res.status(404).send('No such movie found');

        res.send(movie);
    } catch (exception) {
        res.status(400).send(exception.message);
    }
});


module.exports = router;