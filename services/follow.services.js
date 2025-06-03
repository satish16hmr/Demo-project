const Follower = require('../model/follow.model');
const User = require('../model/user.model');


async function followUser(follower_id, following_id) {
    const [follow, created] = await Follower.findOrCreate({
        where: { follower_id, following_id }
    });
    if (!created) {
        throw new Error('Already following this user.');
    }
    return follow;
}


async function unfollowUser(follower_id, following_id) {
    const follow = await Follower.findOne({
        where: { follower_id, following_id }
    });
    if (!follow) {
        throw new Error('Not following this user.');
    }
    await follow.destroy();
    return true;
}
 ``
async function getFollowers(userId) {
    return Follower.findAll({
        where: { following_id: userId },
        include: [{
            model: User,
            as: 'Follower',
            attributes: ['id', 'name', 'email']
        }]
    });
}

async function getFollowing(userId) {
    return Follower.findAll({
        where: { follower_id: userId },
        include: [{
            model: User,
            as: 'Following',
            attributes: ['id', 'name', 'email']
        }]
    });
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};