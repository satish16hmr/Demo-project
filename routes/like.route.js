const express = require('express');
const router = express.Router();
const likeController = require('../controller/like.controller');
const authMiddleware = require('../middleware/auth.middleware');

console.log('like routes loaded');

router.post('/like-comment', authMiddleware.authentication, likeController.likeAndCommentPost);

router.post('/alllikes', authMiddleware.authentication, likeController.alllikes);


module.exports = router;