const Follower = require('../model/follow.model');
const User = require('../model/user.model');


module.exports.followUser = async (req, res) => {
    const follower_id = req.user.id;
    const following_id = parseInt(req.params.id);
    console.log(`Follower ID: ${follower_id}, Following ID: ${following_id}`);

    if (follower_id === following_id) {
        return res.status(400).json({ message: "You can't follow yourself." });
    }

    try {
        const [follow, created] = await Follower.findOrCreate({
            where: { follower_id, following_id }
        });
        if (!created) {
            return res.status(400).json({ message: 'Already following this user.' });
        }
        res.status(200).json({ message: 'User followed successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};


module.exports.unfollowUser = async (req, res) => {
    const follower_id = req.user.id;
    const following_id = parseInt(req.params.id);

    if (follower_id === following_id) {
        return res.status(400).json({ message: "You can't unfollow yourself." });
    }

    try {
        const follow = await Follower.findOne({
            where: { follower_id, following_id }
        });

        if (!follow) {
            return res.status(404).json({ message: 'Not following this user.' });
        }

        await follow.destroy();

        res.status(200).json({ message: 'User unfollowed successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};


module.exports.getFollowers = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const followers = await Follower.findAll({
            where: { following_id: userId },
            include: [{ model: User, as: 'Follower', attributes: ['id', 'name', 'email'] }]
        });
        res.status(200).json({ followers });
    } catch (err) {
        res.status(500).json({
            message: 'Server error while fetching followers.',
            error: err.message
        });
    }
};


module.exports.getFollowing = async (req, res) => {
    console.log(`Fetching following for user ID: ${req.params.id}`);
  const userId = parseInt(req.params.id);
  try {
    const following = await Follower.findAll({
      where: { follower_id: userId },
      include: [{ model: User, as: 'Following', attributes: ['id', 'name', 'email'] }]
    });
    res.status(200).json({ following });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};