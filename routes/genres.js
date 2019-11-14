const express = require('express');
const { Genre, validateGenre } = require('../models/genre');
const dbDebugger = require('debug')('app:db');

const router = express.Router();


router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const requestedGenreID = req.params.id;

    try {
        const genre = await Genre.findById(requestedGenreID);

        if (!genre) return res.send('No such genre found');

        res.send(genre);
    } catch (exception) {
        dbDebugger(exception.message);
        res.send('An Error Occurred');
    }

});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.send(error.message);

    const genre = new Genre(req.body);

    try {
        await genre.save();
        res.send(genre);
    } catch (exception) {
        res.send(exception.message);
    }


});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.send(error.message);

    const requestedGenreID = req.params.id;

    try {
        const genre = await Genre.findByIdAndUpdate(requestedGenreID, {
            $set: req.body
        }, { new: true });
        if (!genre) return res.status(404).send('No such genre found');
        res.send(genre);
    } catch (exception) {
        return res.status(400).send(exception.message);
    }
});

router.delete('/:id', async (req, res) => {
    const requestedGenreID = req.params.id;

    try {
        const genre = await Genre.findByIdAndDelete(requestedGenreID);
        if (!genre) return res.status(404).send('No such genre found');

        res.send(genre);
    } catch (exception) {
        res.status(400).send(exception.message);
    }
});



module.exports = router;