const Follower = require('../model/follow.model');
const User = require('../model/user.model');
const followService = require('../services/follow.services');


module.exports.followUser = async (req, res) => {
    const follower_id = req.user.id;
    const following_id = parseInt(req.params.id);

    if (follower_id === following_id) {
        return res.status(400).json({ message: "You can't follow yourself." });
    }

    try {
        await followService.followUser(follower_id, following_id);
        res.status(200).json({ message: 'User followed successfully.' });
    } catch (err) {
        res.status(400).json({ message: err.message || 'Server error.' });
    }
};


module.exports.unfollowUser = async (req, res) => {
    const follower_id = req.user.id;
    const following_id = parseInt(req.params.id);

    if (follower_id === following_id) {
        return res.status(400).json({ message: "You can't unfollow yourself." });
    }

    try {
        await followService.unfollowUser(follower_id, following_id);
        res.status(200).json({ message: 'User unfollowed successfully.' });
    } catch (err) {
        res.status(400).json({ message: err.message || 'Server error.' });
    }
};



module.exports.getFollowers = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const followers = await followService.getFollowers(userId);
        res.status(200).json({ followers });
    } catch (err) {
        res.status(500).json({
            message: 'Server error while fetching followers.',
            error: err.message
        });
    }
};


module.exports.getFollowing = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const following = await followService.getFollowing(userId);
        res.status(200).json({ following });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};