const express = require('express');
const router = express.Router();
const likeController = require('../controller/like.controller');
const authMiddleware = require('../middleware/auth.middleware');

console.log('like routes loaded');

router.post('/posts/:id/like', authMiddleware.authentication, likeController.likePost);

router.delete('/posts/:id/like', authMiddleware.authentication, likeController.unlikePost);

router.get('/likes', authMiddleware.authentication, likeController.likes);

module.exports = router;