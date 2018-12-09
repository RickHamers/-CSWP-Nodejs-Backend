/*
    auth_controller.js - Controller for authentication purposes
 */

/* Requiring the necessary libraries and assets */
let User = require('../model/user');
const assert = require('assert');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config/config');
const ApiError = require('../model/ApiError');



module.exports = {
    registerUser(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A POST request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '=-=-=-=-=-=-=-=-=-=-=-=-=- REGISTER USER -=-=-=-=-=-=-=-=-=-=-=-=-=');
        try{
            /* validation */
            console.log(req.body);
            assert(req.body.username, 'username must be provided');
            assert(req.body.password, 'password must be provided');

            /* making constants with username and password from the request's body */
            const username = req.body.username || '';
            const password = req.body.password || '';

            /* hashing the password with bcrypt */
            var hashedPassword = bcrypt.hashSync(password);

            /* create a new user with these constants */
            User.create({
                    username: username,
                    password: hashedPassword
                },
                /* registering the user and returning the token */
                function (err, user) {
                    if (err) return res.status(500).send("An error occurred whilst registering the user");
                    // create a token
                    const token = jwt.sign({id: user._id}, config.secretkey, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({auth: true, token: token});

                })

        } catch(error) {next(new ApiError(error.message, 422))}
    },

    loginUser(req, res, next) {
        console.log('-=-=-=-=-=-=-=-=-=-=- A POST request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '=-=-=-=-=-=-=-=-=-=-=-=-=- LOGIN USER -=-=-=-=-=-=-=-=-=-=-=-=-=');
        try{
            assert(req.body.username, 'username must be provided');
            assert(req.body.password, 'password must be provided');

            /* making constants with username and password from the request's body */
            const username = req.body.username || '';
            const password = req.body.password || '';

            /* log in the user */
            User.findOne({ username: username })
                .then((user) => {
                    if (user !== null){
                        let passwordIsValid = bcrypt.compareSync(password, user.password);
                        if(!passwordIsValid) {
                            console.log('-=-=-=-=-=-=-=-=-=-=- auth failed -=-=-=-=-=-=-=-=-=-=-');
                            return res.status(401).send({ auth: false, token: null })
                        }  else if (passwordIsValid) {
                            console.log('-=-=-=-=-=-=-=-=-=-=- auth succeeded -=-=-=-=-=-=-=-=-=-=-');
                            var token = jwt.sign({ id: user._id }, config.secretkey, {
                                expiresIn: 86400 //Expires in 24 hrs
                            });
                            res.status(200).send({ auth: true, token: token });
                        }
                    }
                })
                .catch((error) => next(new ApiError(error.toString(), 500)))
        } catch(error) {next(new ApiError(error.message, 422))}
    },

    logoutUser(req, res, next){
        console.log('-=-=-=-=-=-=-=-=-=-=- A GET request was made -=-=-=-=-=-=-=-=-=-=-' + '\n' +
            '=-=-=-=-=-=-=-=-=-=-=-=-=- LOGOUT USER -=-=-=-=-=-=-=-=-=-=-=-=-=');
        res.status(200).send({ auth: false, token: null })
    }
};




