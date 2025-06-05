import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Notification = sequelize.define('Notification', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

}, {
    timestamps: true,
});

Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Notification.belongsTo(models.User, { foreignKey: 'fromUserId', as: 'fromUser' });
    // Notification.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
};

export default Notification;





