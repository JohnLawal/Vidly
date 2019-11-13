const express = require('express');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customers');
const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);

const router = express.Router();

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateRented');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const requestedRentalID = req.params.id;

    try {
        const rental = await Rental.findById(requestedRentalID);

        if (!rental) return res.status(404).send('No such rental found');

        res.send(rental);
    } catch (exception) {
        res.send(exception.message);
    }

});

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.message);
    try {
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Invalid Customer');

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid Movie');

        if (movie.numberInStock === 0) return res.status(400).send('Movie is not in stock');

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });

        // rental = await rental.save();

        // movie.numberInStock--;
        // movie.save();

        try {
            new Fawn.Task()
                .save('rentals', rental)
                .update('movies', { _id: movie._id }, {
                    $inc: { numberInStock: -1 }
                }).run();
        } catch (exception) {
            return res.status(500).send('Transaction Error');
        }

        res.send(rental);
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