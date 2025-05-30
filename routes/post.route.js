const express = require('express');
const router = express.Router();
const postController = require('../controller/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../utils/multer');

console.log('post routes loaded');

router.post('/Create-Post', authMiddleware.authentication, upload.single('image'), postController.createPost);

router.put('/update/:id', authMiddleware.authentication, upload.single('image'), postController.updatePost);

router.delete('/delete/:id', authMiddleware.authentication, postController.deletePost);

router.get('/getAllPosts', authMiddleware.authentication, postController.getAllPosts);

router.get('/getUserLoginFeed', authMiddleware.authentication, postController.getUserLoginFeed);


module.exports = router;