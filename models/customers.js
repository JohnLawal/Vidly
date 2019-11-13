const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model('Customer', customerSchema);


function validateCustomer(customer) {
    const customerSchema = {
        name: Joi.string().min(5).max(20).required(),
        phone: Joi.string().min(5).max(20).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, customerSchema);
}
module.exports = { Customer, validateCustomer, customerSchema };