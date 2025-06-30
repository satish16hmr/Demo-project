import express from 'express';
import postController from '../controllers/post.controller.js';
import authentication from '../middleware/auth.middleware.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/Create-Post', authentication, upload.single('image'), postController.createPost);

router.put('/update/:id', authentication, upload.single('image'), postController.updatePost);

router.delete('/delete/:id', authentication, postController.deletePost);

router.get('/getAllPosts/:id', authentication, postController.getAllPosts);

router.get('/getUserLoginFeed', authentication, postController.getUserLoginFeed);

router.post('/like/:id', authentication, postController.toggleLikePost);

router.get('/likes/:id', authentication, postController.likes);

router.post('/posts/:id/comment', authentication, postController.commentPost);

router.get('/comments/:id',authentication, postController.getComments);

router.delete('/posts/:id/delete', authentication, postController.deleteComment);

router.patch('/posts/:id/update', authentication, postController.updateComment);

export default router;