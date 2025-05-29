const User = require('./user.model');
const Follower = require('./follow.model');

const models = {
  User,
  Follower,
};

// Set up associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;