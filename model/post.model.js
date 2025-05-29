const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
    author: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    comments: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

},
    {
        timestamps: false,
        tableName: 'Posts'
    });

module.exports = Post;