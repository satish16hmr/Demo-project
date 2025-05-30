const express = require('express');
const router = express.Router();
const commentController = require('../controller/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/posts/:id/comment', authMiddleware.authentication, commentController.commentPost);

router.get('/posts/:id/comments', authMiddleware.authentication, commentController.getComments);

module.exports = router;