import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';

const Comment = sequelize.define('Comment', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
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
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'Comments'
});

Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(Comment, { foreignKey: 'userId' });
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
};

export default Comment;