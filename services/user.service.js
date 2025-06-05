import User from '../models/user.model.js'
import Follower from '../models/follow.model.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';


async function findUserByEmail(email) {
    return User.findOne({ where: { email } });
}

async function createUser(data) {
    data.password = await bcrypt.hash(data.password, 10);
    return User.create(data);
}


async function searchUsers(query) {
    return User.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } },
                { lastname: { [Op.iLike]: `%${query}%` } },
                { email: { [Op.iLike]: `%${query}%` } }
            ]
        },
        attributes: ['id', 'name', 'lastname', 'email']
    });
}


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

async function createNotification({ userId, fromUserId, type, message }) {
    console.log('Creating notification:', { userId, fromUserId, type, message });
    return Notification.create({
        userId,
        fromUserId,
        type,
        message,
    });
}

export default {
    findUserByEmail,
    createUser,
    searchUsers,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    createNotification
}
