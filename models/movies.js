const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genreSchema,
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const movieSchema = {
        title: Joi.string().min(3).max(20).required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number(),
        genreId: Joi.string().required(),
    };

    return Joi.validate(movie, movieSchema);
}


module.exports = { Movie, validateMovie, movieSchema };