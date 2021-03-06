/*
    thread_routes.js - Routing the requests for threads
 */

/* Requiring the necessary libraries and assets */
const express = require('express');
const thread_controller = require('../controllers/thread_controller');
let VerifyToken = require('../auth/VerifyToken');

/* Creating the express router */
let routes = express.Router();

/* The GET thread request */
routes.get('/thread', VerifyToken, thread_controller.getThread);

/* The GET comment request */
routes.get('/comment', VerifyToken, thread_controller.getComment);

/* the GET all threads request */
routes.get('/threads', VerifyToken, thread_controller.getAllThreads);

/* The POST thread request */
routes.post('/thread', VerifyToken, thread_controller.postThread);

/* The POST thread request */
routes.post('/thread/comment', VerifyToken, thread_controller.postCommentOnThread);

/* The POST thread request */
routes.post('/thread/comments', VerifyToken, thread_controller.postCommentOnComment);

/* The POST upvote request */
routes.post('/thread/up', VerifyToken, thread_controller.postUpvote);

/* The POST upvote request */
routes.post('/thread/down', VerifyToken, thread_controller.postDownvote);

/* the UPDATE thread request */
routes.put('/thread', VerifyToken, thread_controller.updateThread);

/* the UPDATE comment request */
routes.put('/comment', VerifyToken, thread_controller.updateComment);

/* The DELETE specific thread request */
routes.delete('/thread', VerifyToken, thread_controller.deleteThread);

/* The DELETE specific comment request */
routes.delete('/comment', VerifyToken, thread_controller.deleteComment);

/* The DELETE all threads request */
routes.delete('/threads', thread_controller.deleteAllThreads);

/* Exporting the routes so they can be used by the other classes */
module.exports = routes;
