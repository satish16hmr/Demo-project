import express from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup',
  [body('email').isEmail(), body('password').isLength({ min: 8 }),
  body('passwordConfirm').exists(),
  ],
  userController.signup
);


router.post('/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  userController.login
);

router.get('/profile', authMiddleware, userController.getProfile);

router.post('/logout', userController.logout);

router.get('/profile/:id', authMiddleware, userController.getUserById);

router.put('/profile/:id', authMiddleware, userController.updateProfile);

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);

router.delete('/delete/:id', authMiddleware, userController.deleteUser);

router.get('/search', authMiddleware, userController.searchUsers);

router.get('/all', authMiddleware, userController.getAllUsers);

router.post('/:id/follow', authMiddleware, userController.followUser);

router.post('/:id/unfollow', authMiddleware, userController.unfollowUser);

router.get('/:id/followers', userController.getFollowers);

router.get('/:id/followings', userController.getFollowing);

router.get('/getNotifications', authMiddleware, userController.getNotifications);

router.delete('/deleteNotification/:id', authMiddleware, userController.deleteNotification);


export default router;