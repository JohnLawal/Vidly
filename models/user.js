const mongoose = require('mongoose');//uses cached version.
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255,
        // validate: {
        //     validator: mongoose.validator.email,
        //     message: "Please enter a valid email"
        // }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    }
}));


function validateUser(user) {
    const userSchema = {
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, userSchema);
}


module.exports = { User, validateUser };