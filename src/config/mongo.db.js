/* mongo.db.js - mongoDB database configuration */
const mongoose = require('mongoose');
const { logger }  = require('./config');

/* use ES6 promises instead of mongoose promise */
mongoose.Promise = global.Promise;

if(process.env.NODE_ENV === 'production'){
    console.log('-=-=-=-=-=-=-=-=-=-=- Connecting to PRODUCTION database -=-=-=-=-=-=-=-=-=-=-');
    mongoose.connect('mongodb+srv://studdit:project@studditproject-oi4rl.azure.mongodb.net/CSWPBackend?retryWrites=true',
        {useNewUrlParser: true});

} else if(process.env.NODE_ENV === 'online-testing'){
        console.log('-=-=-=-=-=-=-=-=-=-=- Connecting to ONLINE TESTING database -=-=-=-=-=-=-=-=-=-=-');
        mongoose.connect('mongodb+srv://studdit:project@studditproject-oi4rl.azure.mongodb.net/CSWPBackendTest?retryWrites=true',
            {useNewUrlParser: true});

}

/* else */ if(process.env.NODE_ENV === 'development'){
    console.log('-=-=-=-=-=-=-=-=-=-=- Connecting to DEVELOP database -=-=-=-=-=-=-=-=-=-=-');
    mongoose.connect('mongodb://localhost/CSWP_Mongo_DB',
        {useNewUrlParser: true});

} else if(process.env.NODE_ENV === 'testing'){
    console.log('-=-=-=-=-=-=-=-=-=-=- Connecting to TESTING database -=-=-=-=-=-=-=-=-=-=-');
    mongoose.connect('mongodb://localhost/CSWP_Mongo_DB_Tests',
    {useNewUrlParser: true});
}

/* mongoose connection to mongoDB database */
var connection = mongoose.connection
    .once('open', () => logger.info('-=-=-=-=-=-=-=-=-=-=- Connected to Mongo Database -=-=-=-=-=-=-=-=-=-=-')) //connection succeeded
    .on('error', (error) => logger.error(error.toString())); // connection failed

/* export the class for use elsewhere */
module.exports = connection;