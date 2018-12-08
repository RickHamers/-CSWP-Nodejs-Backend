/*
    thread_routes.js - Routing the requests for threads
 */

/* Requiring the necessary libraries and assets */
const express = require('express');
const thread_controller = require('../controllers/thread_controller');

/* Creating the express router */
let routes = express.Router();

/* The GET thread request */
routes.get('/thread', thread_controller.getThread);

/* the GET all threads request */
routes.get('/threads', thread_controller.getAllThreads);

/* The POST thread request */
routes.post('/thread', thread_controller.postThread);

/* The POST thread request */
routes.post('/thread/comment', thread_controller.postCommentOnThread);

/* The POST thread request */
routes.post('/thread/comments', thread_controller.postCommentOnComment);

/* The POST upvote request */
routes.post('/thread/up', thread_controller.postUpvote);

/* The POST upvote request */
routes.post('/thread/down', thread_controller.postDownvote);

/* the UPDATE thread request */
routes.put('/thread', thread_controller.updateThread);

/* The DELETE specific thread request */
routes.delete('/thread', thread_controller.deleteThread);

/* The DELETE all threads request */
routes.delete('/threads', thread_controller.deleteAllThreads);

/* Exporting the routes so they can be used by the other classes */
module.exports = routes;
