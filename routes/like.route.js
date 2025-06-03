const express = require('express');
const router = express.Router();
const likeController = require('../controller/like.controller');
const authMiddleware = require('../middleware/auth.middleware');

console.log('like routes loaded');

router.post('/like/:id', authMiddleware.authentication, likeController.toggleLikePost);

router.get('/likes/:id', authMiddleware.authentication, likeController.likes);

module.exports = router;