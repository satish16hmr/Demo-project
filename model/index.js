const User = require('./user.model');
const Post = require('./post.model');
const Follower = require('./follow.model');
const Like = require('./like.model');
const Comment = require('./comment.model');
const Notification = require('./notification.model');

const models = { User, Post, Follower, Like, Comment, Notification };

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;