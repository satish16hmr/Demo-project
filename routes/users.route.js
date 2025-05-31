const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');


console.log('User routes loaded');

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

router.get('/profile', authMiddleware.authentication, userController.getProfile);

router.post('/logout', userController.logout);

router.get('/profile/:id', authMiddleware.authentication, userController.getuserById);

router.put('/profile/:id', authMiddleware.authentication, userController.updateProfile);


router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);

router.delete('/delete/:id', authMiddleware.authentication, userController.deleteuser);

router.get('/search', authMiddleware.authentication, userController.searchUsers);


module.exports = router;