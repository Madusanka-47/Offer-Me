const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PostCommentSchema = new Schema({ 
    postid: { type: String },
    body: { type: String },
    parent_node: { type: Boolean },
    order: { type: Number },
    author: { type: String },
    authorid: { type: Number },
    created_at: { type: Date },
});

module.exports = mongoose.model('PostComment', PostCommentSchema); 