const express = require('express');
const router = express.Router();
const followController = require('../controller/follow.controller');
const authMiddleware = require('../middleware/auth.middleware');

console.log('Follow routes loaded');


router.post('/:id/follow', authMiddleware.authentication, followController.followUser);

router.post('/:id/unfollow', authMiddleware.authentication, followController.unfollowUser);

router.get('/:id/followers' ,followController.getFollowers);

router.get('/:id/followings', followController.getFollowing);


module.exports = router;