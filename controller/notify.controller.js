const notifyModel = require('../model/notification.model');
const User = require('../model/user.model');


module.exports.getNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const notifications = await notifyModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'fromUser',
                attributes: ['id', 'name', 'lastname']
            }]
        });

        // console.log(postId);
        res.status(200).json({

            notifications: notifications.map(notification => ({
                id: notification.id,
                type: notification.type,
                message: notification.message,
                fromUser: {
                    id: notification.fromUser.id,
                    name: notification.fromUser.name,
                    lastname: notification.fromUser.lastname
                },
                createdAt: notification.createdAt
            }))
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching notifications.' });
    }
}


module.exports.deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    const userId = req.user.id;

    console.log(notificationId, userId);

    try {
        const notification = await notifyModel.findOne({ where: { id: notificationId, userId } });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.destroy();
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}