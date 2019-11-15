const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const dbDebugger = require('debug')('app:db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.message);
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) return res.status(400).send("This user already exists");

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        // const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, 10);

        await user.save();

        res.send(_.pick(user, ['_id', 'name', 'email']));
    } catch (exception) {
        res.send(exception.message);
    }
});


module.exports = router;