import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Post = sequelize.define('Post', {
    author: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
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
        defaultValue: 0,
    },

    comments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

}, {
    timestamps: false,
    tableName: 'Posts',
});

Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'author', as: 'user' });
};

export default Post;
