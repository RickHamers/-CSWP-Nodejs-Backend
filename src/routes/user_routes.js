/*
    user_routes.js - Routing the requests for users
 */

/* Requiring the necessary libraries and assets */
const express = require('express');
const user_controller = require('../controllers/user_controller');

/* Creating the express router */
let routes = express.Router();

/* The GET user request */
routes.get('/user', user_controller.getUser);

/* The POST user request */
routes.post('/user', user_controller.postUser);

/* The PUT user request */
routes.put('/user', user_controller.updateUser);

/* The DELETE user request */
routes.delete('/user', user_controller.deleteUser);

/* The DELETE all users request */
routes.delete('/user', user_controller.deleteAllUsers);

module.exports = routes;
