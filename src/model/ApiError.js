/* ApiError.js - general api errorhandling */
'use strict';

class ApiError {

    constructor(message, code) {
        this.message = message;
        this.code = code;
        this.datetime = new Date().toISOString()
    }

}

/* export the class for use elsewhere */
module.exports = ApiError;