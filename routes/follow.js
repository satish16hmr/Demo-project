const express = require('express');
const router = express.Router();
const followController = require('../controller/follow.controller');
const authMiddleware = require('../middleware/auth.middleware');

console.log('Follow routes loaded');


router.post('/:id/follow', authMiddleware.authentication, followController.followUser);

router.post('/:id/unfollow', authMiddleware.authentication, followController.unfollowUser);

router.get('/followers', authMiddleware.authentication, followController.getallFollowers);




module.exports = router;