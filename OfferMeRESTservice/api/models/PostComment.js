const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostCommentSchema = new Schema({
    postid: { type: String },
    user: {
        name: { type: String },
        avatar: { type: String }
    },
    content: { type: String },
    display_order: {type: Number},
    created_at: { type: String },
});

module.exports = mongoose.model('PostComment', PostCommentSchema); 