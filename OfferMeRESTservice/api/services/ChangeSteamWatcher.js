const Pusher = require('pusher');
//Watch the replica set and push the changes to the Pusher envirenoment.
var pusher = new Pusher({
    appId: '960215',
    key: 'dc0082564549a4440b3c',
    secret: 'a294d2028767eb6fe5f4',
    cluster: 'ap2',
    // encrypted: true,
    useTLS: true,
});

var watcher = (db) => {
    const channel = 'post_comment';
    const taskCollection = db.collection('postcomments');
    const changeStream = taskCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change); // for debuging the oupu valuve

        if (change.operationType === 'insert') {
            const comment = change.fullDocument;
            pusher.trigger(
                channel,
                'inserted',
                {
                    id: comment._id,
                    postid: comment.postid,
                    body: comment.body,
                    parent_node: comment.parent_node,
                    order: comment.order,
                    author: comment.author,
                    authorid: comment.authorid,
                    created_at: comment.created_at,
                }
            );
        } else if (change.operationType === 'delete') {
            pusher.trigger(
                channel,
                'deleted',
                change.documentKey._id
            );
        }
    });
};
module.exports = watcher;