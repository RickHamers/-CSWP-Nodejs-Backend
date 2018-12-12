/*
    thread_controller.js - controller for parsing requests regarding threads
 */

/* Requiring the necessary libraries and assets */
const ApiError = require('../model/ApiError');
const Thread = require('../model/thread').thread;
const Comment = require('../model/thread').comment;
const User = require('../model/user');
const assert = require('assert');
const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

module.exports = {

    getThread(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A GET request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '=-=-=-=-=-=-=-=-=-=-=-=-=- GET a thread -=-=-=-=-=-=-=-=-=-=-=-=-=');
        try {
            /* validation */
            assert(req.query.id, 'id must be provided');

            /* making constant with title from the request's body */
            const id = req.query.id || '';

            /* get thread with the given constant */
            Thread.findOne({_id: id})
                .then((thread) => {
                    if (thread !== null) {
                        console.log('-=-=-=-=-=-=-=-=-=-=- Found thread ' + thread.title + ' -=-=-=-=-=-=-=-=-=-=-');
                        res.status(200).json(thread).end()
                    } else {
                        next(new ApiError('thread not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch (error) {
            next(new ApiError(error.message, 422))
        }
    },

    getComment(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A GET request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '=-=-=-=-=-=-=-=-=-=-=-=-=- GET a comment -=-=-=-=-=-=-=-=-=-=-=-=-=');
        try {
            /* validation */
            assert(req.query.id, 'id must be provided');

            /* making constant with title from the request's body */
            const id = req.query.id || '';

            /* get thread with the given constant */
            Comment.findOne({_id: id})
                .then((comment) => {
                    if (comment !== null) {
                        res.status(200).json(comment).end()
                    } else {
                        next(new ApiError('comment not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch (error) {
            next(new ApiError(error.message, 422))
        }
    },

    getAllThreads(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A GET request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=- GET all threads -=-=-=-=-=-=-=-=-=-=-=-=');

        Thread.find({}, {_id: 1, title: 1, content: 1, username: 1, upVote: 1, downVote: 1})
            .then((threads) => {
                if (threads.length > 0 ) {
                    res.status(200).json(threads).end()
                } else {
                    next(new ApiError('no threads found', 404))
                }
            })
            .catch((error) => next(new ApiError(error.toString(), 500)));
    },

    /* function used to post a new thread */
    postThread(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A POST request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '=-=-=-=-=-=-=-=-=-=-=-=-=- POST a thread -=-=-=-=-=-=-=-=-=-=-=-=-=');

        try {
            /* validation */
            assert(req.body.username, 'usernameme must be provided');
            assert(req.body.title, 'title must be provided');
            assert(req.body.content, 'content must be provided');

            /* making constants with username, title and content from the request's body */
            const username = req.body.username || '';
            const title = req.body.title || '';
            const content = req.body.content || '';

            /* create a new thread with these constants */
            console.log('-=-=-=-=-=-=-=-=-=-=- Creating thread ' + title + ' -=-=-=-=-=-=-=-=-=-=-');
            const newThread = new Thread({username: username, title: title, content: content});

            /* save the new thread to the database */
            User.findOne({username: username})
                .then((user) => {
                    if (user !== null) {
                        Thread.findOne({title: title})
                            .then((thread) => {
                                if (thread === null) {
                                    newThread.save() //Saving the Thread to the database - .save returns a promise
                                        .then(() => res.status(200).json(newThread).end())
                                        .catch((error) => next(new ApiError(error.toString(), 500)));
                                } else {
                                    next(new ApiError('thread ' + title + ' already exists'))
                                }
                            })
                            .catch((error) => next(new ApiError(error.toString(), 500)));
                    } else {
                        next(new ApiError('user not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch (error) {
            next(new ApiError(error.message, 422))
        }
    },

    /* function used to post a new comment */
    postCommentOnThread(req, res, next){
        console.log('-=-=-=-=-=-=-=-=-=-=- A POST request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-=- POST comment on thread -=-=-=-=-=-=-=-=-=-=-=-=-=-');

        try{
            /* validation */
            //assert(req.query.id, 'id must be provided');
            assert(req.body.content, 'content must be provided');
            assert(req.body.username, 'username must be provided');
            assert(req.body.threadId, 'thread id must be provided');

            /* making constants with (new) title and (new) content from the request's body */
            //const id = req.query.id || '';
            const content = req.body.content || '';
            const username = req.body.username || '';
            const threadId = req.body.threadId || '';

            const newComment = new Comment({content: content, threadId: threadId, username: username});

            User.findOne({username: username})
                .then((user) => {
                    if (user !== null) {
                        Thread.findOne({_id: threadId})
                            .then((thread) => {
                                if (thread !== null) {
                                    thread.comments.push(newComment);
                                    Promise.all([newComment.save(), thread.save()])
                                        .then(() => res.status(200).json(newComment).end())
                                        .catch((error) => next(new ApiError(error.toString(), 500)));
                                } else {
                                    next(new ApiError('thread ' + title + ' does not exists'))
                                        .catch((error) => next(new ApiError(error.toString(), 500)));
                                }
                            })
                            .catch((error) => next(new ApiError(error.toString(), 500)));
                    } else {
                        next(new ApiError('user not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch (error) {
            next(new ApiError(error.message, 422))
        }
    },

    /* function used to post a new comment on comment */
    postCommentOnComment(req, res, next){
        console.log('-=-=-=-=-=-=-=-=-=-=- A POST request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-=- POST comment on comment -=-=-=-=-=-=-=-=-=-=-=-=-=-');

        try{
            /* validation */
            assert(req.query.id, 'id must be provided');
            assert(req.body.content, 'content must be provided');
            assert(req.body.username, 'username must be provided');
            assert(req.body.threadId, 'thread id must be provided');

            /* making constants with (new) title and (new) content from the request's body */
            const id = req.query.id || '';
            const content = req.body.content || '';
            const username = req.body.username || '';
            const threadId = req.body.threadId || '';

            const newComment = new Comment({content: content, threadId: threadId, username: username});

            User.findOne({username: username})
                .then((user) => {
                    if (user !== null) {
                        Comment.findOne({_id: id})
                            .then((comment) => {
                                if (comment !== null) {
                                    comment.comments.push(newComment);
                                    Promise.all([newComment.save(), comment.save()])
                                        .then(() => res.status(200).json(newComment).end())
                                        .catch((error) => next(new ApiError(error.toString(), 500)));
                                } else {
                                    next(new ApiError('thread ' + title + ' does not exists'))
                                        .catch((error) => next(new ApiError(error.toString(), 500)));
                                }
                            })
                            .catch((error) => next(new ApiError(error.toString(), 500)));
                    } else {
                        next(new ApiError('user not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch (error) {
            next(new ApiError(error.message, 422))
        }
    },

    /* function used to post a opvote on thread */
    postUpvote(req, res, next){
        console.log('-=-=-=-=-=-=-=-=-=-=- A PUT request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-=- PUT thread -=-=-=-=-=-=-=-=-=-=-=-=-=-');

        /* validation */
        assert(req.query.username, 'username must be provided');
        assert(req.query.password, 'password must be provided');
        assert(req.body.id, 'id must be provided');

        /* making constants with (new) title and (new) content from the request's body */
        const password = req.query.password || '';
        const username = req.query.username || '';
        const id = req.body.id || '';
        //const userid = req.body.iduser || '';

        //const person = new User({name: name, password: password});

        User.findOne({name: name})
            .then((user) => {
                if (user !== null) {
                    Thread.findOne({_id: id})
                        .then((thread) => {
                            if (thread !== null) {

                                const upVoteIndex = thread.upVote.indexOf(user._id);
                                console.log(thread.upVote.indexOf(user._id));
                                thread.downVote.pull(user);
                                if(upVoteIndex === -1){
                                    console.log('-=-=-=-=-=-=-=-=-=-=- upvote eddid to thread -=-=-=-=-=-=-=-=-=-=-');
                                    thread.upVote.push(user);
                                }
                                Promise.all([thread.save()])
                                    .then(() => res.status(200).json(thread).end())
                                    .catch((error) => next(new ApiError(error.toString(), 500)));
                            } else {
                                Comment.findOne({_id: id})
                                    .then((comment) => {
                                        if (comment !== null) {
                                            const upVoteIndex = thread.upVote.indexOf(user._id);
                                            console.log(thread.upVote.indexOf(user._id));
                                            comment.downVote.pull(user);
                                            if(upVoteIndex === -1){
                                                console.log('-=-=-=-=-=-=-=-=-=-=- upvote eddid to thread -=-=-=-=-=-=-=-=-=-=-');
                                                comment.upVote.push(user);
                                            }
                                            Promise.all([comment.save()])
                                                .then(() => res.status(200).json(comment).end())
                                                .catch((error) => next(new ApiError(error.toString(), 500)));
                                        } else {
                                            next(new ApiError('thread ' + title + ' does not exists'))
                                                .catch((error) => next(new ApiError(error.toString(), 500)));
                                        }
                                    })
                            }
                        })
                        .catch((error) => next(new ApiError(error.toString(), 500)));
                } else {
                    next(new ApiError('user not found', 404));
                }
            })
            .catch((error) => next(new ApiError(error.toString(), 500)));
    },

    /* function used to post a downvote on thread */
    postDownvote(req, res, next){
        console.log('-=-=-=-=-=-=-=-=-=-=- A PUT request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-=- PUT thread -=-=-=-=-=-=-=-=-=-=-=-=-=-');

        /* validation */
        assert(req.query.name, 'name must be provided');
        assert(req.query.password, 'password must be provided');
        assert(req.body.id, 'id must be provided');

        /* making constants with (new) title and (new) content from the request's body */
        const password = req.query.password || '';
        const username = req.query.username || '';
        const id = req.body.id || '';

        User.findOne({username: username})
            .then((user) => {
                if (user !== null) {
                    Thread.findOne({_id: id})
                        .then((thread) => {
                            if (thread !== null) {

                                const downVoteIndex = thread.downVote.indexOf(user._id);
                                console.log(thread.downVote.indexOf(user._id));
                                thread.upVote.pull(user);
                                if(downVoteIndex === -1){
                                    console.log('-=-=-=-=-=-=-=-=-=-=- upvote added to thread -=-=-=-=-=-=-=-=-=-=-');
                                    thread.downVote.push(user);
                                }
                                Promise.all([thread.save()])
                                    .then(() => res.status(200).json(thread).end())
                                    .catch((error) => next(new ApiError(error.toString(), 500)));
                            } else {
                                Comment.findOne({_id: id})
                                    .then((comment) => {
                                        if (comment !== null) {
                                            const downVoteIndex = comment.downVote.indexOf(user._id);
                                            console.log(comment.downVote.indexOf(user._id));
                                            comment.upVote.pull(user);
                                            if(downVoteIndex === -1){
                                                console.log('-=-=-=-=-=-=-=-=-=-=- upvote added to thread -=-=-=-=-=-=-=-=-=-=-');
                                                comment.downVote.push(user);
                                            }
                                            Promise.all([comment.save()])
                                                .then(() => res.status(200).json(comment).end())
                                                .catch((error) => next(new ApiError(error.toString(), 500)));
                                        } else {
                                            next(new ApiError('thread ' + title + ' does not exists'))
                                                .catch((error) => next(new ApiError(error.toString(), 500)));
                                        }})
                            }
                        })
                        .catch((error) => next(new ApiError(error.toString(), 500)));
                } else {
                    next(new ApiError('user not found', 404));
                }
            })
            .catch((error) => next(new ApiError(error.toString(), 500)));
    },

    /* function used to update a new thread */
    updateThread(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A PUT request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-=- PUT thread -=-=-=-=-=-=-=-=-=-=-=-=-=-');
        try {
            /* validation */
            assert(req.query.id, 'id must be provided');
            assert(req.body.title, 'title must be provided');
            assert(req.body.content, 'content must be provided');



            /* making constants with (new) title and (new) content from the request's body */
            const id = req.query.id || '';
            const title = req.body.title || '';
            const content = req.body.content || '';

            /* update the thread with the given constants */
            Thread.findOne({_id: id})
                .then((thread) => {
                    if (thread !== null) {
                        console.log('-=-=-=-=-=-=-=-=-=-=- Updating thread ' + thread.title + ' -=-=-=-=-=-=-=-=-=-=-');
                        Thread.updateOne({title: title}, {content: content})
                            .then(() => res.status(200).json('thread updated').end())
                            .catch((error) => next(new ApiError(error.toString(), 500)));
                    } else {
                        next(new ApiError('thread not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch (error) {
            next(new ApiError(error.message, 422))
        }
    },

    deleteThread(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A DELETE request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '=-=-=-=-=-=-=-=-=-=-=-=-=- DELETE a thread -=-=-=-=-=-=-=-=-=-=-=-=-=');
        try {
            /* validation */
            assert(req.query.id, 'id must be provided');

            /* making constant with title from the request's body */
            const id = req.query.id || '';

            /* delete thread with the given constant */
            Thread.findOne({_id: id})
                .then((thread) => {
                    if (thread !== null) {
                        console.log('-=-=-=-=-=-=-=-=-=-=- Deleting thread ' + thread.title + ' -=-=-=-=-=-=-=-=-=-=-');
                        Thread.deleteOne({ _id: id })
                            .then(() => res.status(200).json('thread deleted').end())
                            .catch((error) => next(new ApiError(error.toString(), 500)));
                    } else {
                        next(new ApiError('thread not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch (error) {
            next(new ApiError(error.message, 422))
        }
    },

    /* function used to delete all threads */
    deleteAllThreads(req, res, next){
        console.log('-=-=-=-=-=-=-=-=-=-=- A DELETE request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=- DELETE all threads -=-=-=-=-=-=-=-=-=-=-=-=');

        mongoose.connection.collections.threads.drop()
            .then(() => res.status(200).json('dropped thread collection').end())
            .catch((error) => next(new ApiError(error.toString(), 500)));

    }

};