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
user_routes = require('./routes/user_routes');

/* server setup */
const port = process.env.PORT || webPort;

/* initialize necessary assets */
const app = express();

/* user morgan as logger and user bodyparser to parse JSON */
app.use(morgan('dev'));
app.use(bodyparser.json());

/* parse all the defined endpoints */
app.use('/api', user_routes);

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