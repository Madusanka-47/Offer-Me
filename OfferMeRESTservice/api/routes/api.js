const PostComment = require('../models/PostComment');
const express = require('express');


module.exports = (app) => {
    app.post('/new', (req, res) => {
        PostComment.create({
            postid: req.body.postid,
            body: req.body.body,
            parent_node: false,
            order: req.body.order,
            author: req.body.author,
            authorid: req.body.authorid,
            created_at: req.body.created_at,
        }, (err, comment_) => {
            if (err) {
                console.log('CREATE Error: ' + err);
                res.status(500).send('Error');
            } else {
                res.status(200).json(comment_);
            }
        });
    });


    app.route('/:id')
        /* DELETE */
        .delete((req, res) => {
            PostComment.findById(req.params.id, (err, comment_) => {
                if (err) {
                    console.log('DELETE Error: ' + err);
                    res.status(500).send('Error');
                } else if (comment_) {
                    comment_.remove(() => {
                        res.status(200).json(comment_);
                    });
                } else {
                    res.status(404).send('Not found');
                }
            });
        });
};