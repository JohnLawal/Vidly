const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);//adding a new property to JOI which is a method

const config = require('config');
const dbDebugger = require('debug')('app:db');
const consoleDebugger = require('debug')('app:clg');

const app = express();

mongoose.connect(config.get('db-url'), { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => dbDebugger('Connected to the Db'))
    .catch(err => dbDebugger('Could not connect to the Db ', err));

const genresRoute = require('./routes/genres');
const customersRoute = require('./routes/customers');
const moviesRoute = require('./routes/movies');
const rentalRoute = require('./routes/rentals');
const usersRoute = require('./routes/users');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Vidly');
});

app.use('/api/genres', genresRoute);
app.use('/api/customers', customersRoute);
app.use('/api/movies', moviesRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/users', usersRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => consoleDebugger(`Listening on port ${port}`));