import User from './user.model.js';
import Post from './post.model.js';
import Follower from './follow.model.js';
import Like from './like.model.js';
import Comment from './comment.model.js';
import Notification from './notification.model.js';

const models = { User, Post, Follower, Like, Comment, Notification };

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;
