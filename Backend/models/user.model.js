import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';

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
});

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Association method
User.associate = (models) => {
  User.hasMany(models.Follower, { foreignKey: 'following_id', as: 'Followers' });
  User.hasMany(models.Follower, { foreignKey: 'follower_id', as: 'Followings' });
  User.hasMany(models.Post, { foreignKey: 'author', as: 'posts' });
  User.hasMany(models.Like, { foreignKey: 'userId', as: 'likes' });
  // User.hasMany(models.Comment, { foreignKey: 'author', as: 'comments' });
};

export default User;
