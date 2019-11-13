const mongoose = require('mongoose');
const Joi = require('joi');
const { movieSchema } = require('./movies');
const { customerSchema } = require('./customers');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                maxlength: 20,
                minlength: 5
            },
            isGold: { type: Boolean, default: false },
            phone: {
                type: String,
                required: true,
                maxlength: 20,
                minlength: 5
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 20,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    rentalFee: {
        type: Number,
        min: 0
    },
    dateRented: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    dateReturned: {
        type: Date,
    }
}));

function validateRental(rental) {
    const rentalSchema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
    };

    return Joi.validate(rental, rentalSchema);
}


module.exports = { Rental, validateRental };