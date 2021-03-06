/*
    server.js - project main class
 */

/* require necessary modules and files */
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const ApiError = require('./model/ApiError');
const { webPort, logger } = require('./config/config');
require('./config/mongo.db');

/* require all routes */
auth_routes = require('./routes/auth_routes');
user_routes = require('./routes/user_routes');
thread_routes = require('./routes/thread_routes');

/* server setup */
const port = process.env.PORT || webPort;

/* initialize necessary assets */
const app = express();

/* user morgan as logger and user bodyparser to parse JSON */
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, x-access-token ,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if(req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next();
    }
});

/* parse all the defined endpoints */
app.use('/api', auth_routes);
app.use('/api', user_routes);
app.use('/api', thread_routes);

/* catch all non-existing endpoint requests and report a 404 error */
app.use('*', function (req, res, next) {
    // logger.error('Non-existing endpoint')
    const error = new ApiError('Non-existing endpoint', 404);
    next(error)
});

/* Catch-all error handler according to Express documentation */
app.use((err, req, res, next) => {
    logger.error(err);
    res.status((err.code || 404)).json(err).end()
});

/* listen for incoming requests */
app.listen(port, () => {
    logger.info('-=-=-=-=-=-=-=-=-=-=- Server running, listening on port ' + port + ' -=-=-=-=-=-=-=-=-=-=-');
});

/* Export the server for testing purposes */
module.exports = app;