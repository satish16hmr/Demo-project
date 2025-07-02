import User from "../models/user.model.js";
import Follower from "../models/follow.model.js";
import Notification from "../models/notification.model.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

async function findUserByEmail(email) {
  return await User.findOne({
    where: { email },
  });
}

async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await User.create({ ...data, password: hashedPassword });
}

async function searchUsers(query) {
  const searchCondition = {
    [Op.or]: [
      { name: { [Op.iLike]: `${query}%` } },
      { lastname: { [Op.iLike]: `${query}%` } },
      // { email: { [Op.iLike]: `%${query}%` } },
    ],
  };

  return await User.findAll({
    where: searchCondition,
    attributes: ["id", "name", "lastname", "email"],
  });
}

async function followUser(follower_id, following_id) {
  const [follow, created] = await Follower.findOrCreate({
    where: { follower_id, following_id },
  });

  if (!created) {
    throw new Error("Already following this user.");
  }

  return follow;
}

async function unfollowUser(follower_id, following_id) {
  const follow = await Follower.findOne({
    where: { follower_id, following_id },
  });

  if (!follow) {
    throw new Error("Not following this user.");
  }

  await follow.destroy();
  return true;
}

async function getFollowers(userId) {
  return await Follower.findAll({
    where: { following_id: userId },
    include: [
      {
        model: User,
        as: "Follower",
        attributes: ["id", "name", "email", "lastname"],
      },
    ],
  });
}

async function getFollowing(userId) {
  return await Follower.findAll({
    where: { follower_id: userId },
    include: [
      {
        model: User,
        as: "Following",
        attributes: ["id", "name", "email", "lastname"],
      },
    ],
  });
}

async function createNotification({ userId, fromUserId, type, message }) {
  console.log("Creating notification:", { userId, fromUserId, type, message });

  return await Notification.create({
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
  createNotification,
};
