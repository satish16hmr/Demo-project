const express = require('express');
const router = express.Router();
const commentController = require('../controller/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/posts/:id/comment', authMiddleware.authentication, commentController.commentPost);

router.get('/posts/:id/comments', authMiddleware.authentication, commentController.getComments);

router.delete('/posts/:id/delete', authMiddleware.authentication, commentController.deleteComment);

router.patch('/posts/:id/update', authMiddleware.authentication, commentController.updateComment);

module.exports = router;