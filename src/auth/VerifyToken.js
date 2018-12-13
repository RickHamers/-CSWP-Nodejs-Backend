/*
    VerifyToken.js - middleware function to check the validity of tokens
 */

/* Requiring the necessary libraries and assets */
var config = require('../config/config');
var jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    let token = req.headers['x-access-token'];
    if(!token)
        return res.status(403).send({ auth: false, message: 'No token provided'});

    jwt.verify(token, config.secretkey, function(err, decoded){
        if(err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token'});

        /* Save to request for use in other routes if all is okay */
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;