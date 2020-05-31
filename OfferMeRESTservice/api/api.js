var router = require('express').Router();

router.use('/PostComment', require('./routes/PostCommentRouter'));
router.use('/Post', require('./routes/PostsRouter'));
router.use('/User', require('./routes/UserRouter'));
router.use('/Point', require('./routes/PointAwardRouter'));

module.exports = router;