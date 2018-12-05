/* config.js - application configuration */
'use strict';

/* set the logging level */
const loglevel = process.env.LOGLEVEL || 'trace';
const secretkey = process.env.SECRETKEY;

/* export the class for use elsewhere */
module.exports = {
    secretkey: secretkey, // local variable
    webPort: process.env.PORT || 3000,

    /* define usage of tracer module */
    logger: require('tracer')
        .console({
            format: [
                "{{timestamp}} <{{title}}> {{file}}:{{line}} : {{message}}"
            ],
            preprocess: function (data) {
                data.title = data.title.toUpperCase();
            },
            dateformat: "isoUtcDateTime",
            level: loglevel
        })
};