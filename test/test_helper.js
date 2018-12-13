/*
    test_helper.js - helper file for testing functionality
 */

/* require necessary modules and files */
const mongoose = require('../src/config/mongo.db');

/* runs once before entire test batch */
before((done) => {
    mongoose.once('open', () => done());
});

/* runs once before each (individual) test */
beforeEach(function(done) {
    this.timeout(10000);
    const { threads, users, comments }  = mongoose.collections;
    users.drop(() => {
        threads.drop(() => done())
    });
});

