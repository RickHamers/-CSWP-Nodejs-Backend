/*
    example_routes.js - Routing the requests for examples
 */

/* Requiring the necessary libraries and assets */
const express = require('express');
const example_controller = require('../controllers/example_controller');

/* Creating the express router */
let routes = express.Router();

/* The GET thread request */
routes.get('/example', example_controller.getExample);

