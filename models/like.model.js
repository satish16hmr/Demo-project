import User from './user.model.js';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Like = sequelize.define('Like', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

// Association method
Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Like.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
};

export default Like;
