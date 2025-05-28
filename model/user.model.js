const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');
const Follower = require('./follow.model');

const User = sequelize.define('User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [8] },
    },

    resetPasswordToken: {
      type: DataTypes.STRING,
    },

    resetPasswordExpires: {
      type: DataTypes.DATE,
    },

  }, {
  timestamps: true,
}
);

User.hasMany(Follower, { foreignKey: 'follower_id', as: 'Followings' });
User.hasMany(Follower, { foreignKey: 'following_id', as: 'Followers' });

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;