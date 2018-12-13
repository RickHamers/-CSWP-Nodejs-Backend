/*
    thread.js - thread model
 */

/* Requiring the necessary libraries and assets */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* creating the comment Schema */
const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    threadId: {
        type: String,
        required:  true
    },
    username: {
        type: String,
        required: true
    },
    upVote:[{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    downVote:[{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]
});

/* creating the thread Schema */
const ThreadSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    upVote:[{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    downVote:[{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment',
    }]
});

function autoPopulateComments(next){
    this.populate('comments');
    next()
}

CommentSchema
    .pre('findOne', autoPopulateComments)
    .pre('find', autoPopulateComments);

/* creating the comment model */
const Comment = mongoose.model('comment', CommentSchema);

ThreadSchema
    .pre('findOne', autoPopulateComments)
    .pre('find', autoPopulateComments);

/* creating the thread model */
const Thread = mongoose.model('thread', ThreadSchema);

/* Exporting User to be used elsewhere in the project */
module.exports = {thread: Thread, comment: Comment};