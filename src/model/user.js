/*
    user.js - user model
 */

/* Requiring the necessary libraries and assets */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Creating the user Schema */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'name already exists']
    },
    password: {
        type: String,
        required: true
    }
});

/* Creating the user model */
const User = mongoose.model('user', UserSchema);

/* Exporting User to be used elsewhere in the project */
module.exports = User;