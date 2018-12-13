/*
    auth_routes.js - Routing the requests for authentication
 */

/* Requiring the necessary libraries and assets */
const express = require('express');
const auth_controller = require('../controllers/auth_controller');

/* Creating the express router */
let routes = express.Router();

/* route for registering a user */
routes.post('/register', auth_controller.registerUser);

/* route for logging in */
routes.post('/login', auth_controller.loginUser);

/* route for logging out */
routes.get('/logout', auth_controller.logoutUser);

/* Exporting the routes so they can be used by the other classes */
module.exports = routes;
