const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');
const dbDebugger = require('debug')('app:db');

const router = express.Router();


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const requestedcustomerID = req.params.id;

    try {
        const customer = await Customer.findById(requestedcustomerID);

        if (!customer) return res.send('No such customer found');

        res.send(customer);
    } catch (exception) {
        res.send(exception.message);
    }

});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.send(error.message);

    const customer = new Customer(req.body);

    try {
        await customer.save();
        res.send(customer);
    } catch (exception) {
        res.send(exception.message);
    }


});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.send(error.message);

    const requestedcustomerID = req.params.id;

    try {
        const customer = await Customer.findByIdAndUpdate(requestedcustomerID, {
            $set: req.body
        }, { new: true });
        if (!customer) return res.status(404).send('No such customer found');
        res.send(customer);
    } catch (exception) {
        return res.status(400).send(exception.message);
    }
});

router.delete('/:id', async (req, res) => {
    const requestedcustomerID = req.params.id;

    try {
        const customer = await Customer.findByIdAndDelete(requestedcustomerID);
        if (!customer) return res.status(404).send('No such customer found');

        res.send(customer);
    } catch (exception) {
        res.status(400).send(exception.message);
    }
});


module.exports = router;