const User = require('./user.model');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Like = sequelize.define('Like', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts',
            key: 'id'
        }
    }
},
    {
        timestamps: true,
    });

// Association method

Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Like.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
}

module.exports = Like;