/*
    user_controller.js - controller for parsing requests regarding examples
 */

/* Requiring the necessary libraries and assets */
const ApiError = require('../model/ApiError');
const mongoose = require('mongoose');
const User = require('../model/user');
const assert = require('assert');
let bcrypt = require('bcryptjs');


module.exports = {

    /* function used to get a specific user */
    getUser(req, res, next){
        console.log('-=-=-=-=-=-=-=-=-=-=- A GET request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
                    '-=-=-=-=-=-=-=-=-=-=-=-=-=- GET a user -=-=-=-=-=-=-=-=-=-=-=-=-=-');
        try {
            /* validation */
            assert(req.query.username, 'username must be provided');

            /* making constant with username from the request's body */
            const username = req.query.username || '';

            /* get user with the given constant */
            User.findOne({ username: username })
                .then((user) => {
                    if(user !== null){
                        console.log('-=-=-=-=-=-=-=-=-=-=- Found user ' + user.username + ' -=-=-=-=-=-=-=-=-=-=-');
                        res.status(200).json(user).end()
                    } else {
                        next(new ApiError('user not found', 404));
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)));
        } catch(error) { next(new ApiError(error.message, 422)) }
    },

    /* function used to update a user */
    updateUser(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A PUT request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-=- PUT a user -=-=-=-=-=-=-=-=-=-=-=-=-=-');

        try {
            /* validation */
            assert(req.body.username, 'username must be provided');
            assert(req.body.password, 'password must be provided');
            assert(req.body.newPassword, 'new password must be provided');


            /* making constants with (new) username and (new) password from the request's body */
            const username = req.body.username || '';
            const password = req.body.password || '';
            const newPassword = req.body.newPassword || '';

            /* hashing the password with bcrypt */
            const hashedNewPassword = bcrypt.hashSync(newPassword);

            /* update the user with the given constants */
            User.findOne({ username: username })
                .then((user) => {
                    if(user !== null){
                        if(bcrypt.compareSync(password, user.password)){
                            console.log('-=-=-=-=-=-=-=-=-=-=- Updating user ' + user.username + ' -=-=-=-=-=-=-=-=-=-=-');
                            User.updateOne({username: username}, {password: hashedNewPassword}) // Find first record with the specific username and update it in the database - .findOneAndUpdate returns a promise
                                .then( () => {
                                    return res.status(200).json('user updated').end()
                                })
                                .catch((error) => next(new ApiError(error.toString(), 500)))
                        } else {
                            next(new ApiError('password does not match', 401));
                        }
                    } else {
                        next(new ApiError('user not found', 404));
                    }
                });
        } catch (error) {next(new ApiError(error.message, 500))
        }
    },

    /* function used to delete a user by username */
    deleteUser(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A DELETE request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-=- DELETE a user -=-=-=-=-=-=-=-=-=-=-=-=-=-');

        try {
            /* validation */
            assert(req.body.username, 'username must be provided');
            assert(req.body.password, 'password must be provided');

            /* making constants with (new) username and (new) password from the request's body */
            const username = req.body.username || '';
            const password = req.body.password || '';

            /* update the user with the given constants */
            User.findOne({username: username})
                .then((user) => {
                    if(user !== null){
                        if(bcrypt.compareSync(password, user.password)){
                            console.log('-=-=-=-=-=-=-=-=-=-=- Deleting user ' + username + ' -=-=-=-=-=-=-=-=-=-=-');
                            User.deleteOne({username: username, password: password})
                                .then( () => {
                                    return res.status(200).json('user deleted').end()
                                })
                                .catch((error) => next(new ApiError(error.toString(), 500)))
                        } else {
                            next(new ApiError('password does not match', 401));
                        }
                    } else {
                        next(new ApiError('user not found', 404));
                    }
                })
        } catch (error) {
            next(new ApiError(error.message, 500))
        }
    },

    /* function used to delete all users */
    deleteAllUsers(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A DELETE request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '-=-=-=-=-=-=-=-=-=-=-=-=-= DELETE all user =-=-=-=-=-=-=-=-=-=-=-=-=-');

        /* drop users collection from database */
        mongoose.connection.collection.users.drop()
            .then(() => {
                return res.status(200).json('dropped users collection').end()
            })
            .catch((error) => next(new ApiError(error.toString(), 500)));
    }
};