const notify = require('../model/notification.model');


async function getNotifications(userId) {
    const notifications = await notify.findAll({
        where: {
            userId: userId,
            isRead: false
        },
        order: [['createdAt', 'DESC']]
    });

    if (!notifications || notifications.length === 0) {
        throw new Error('No notifications found');
    }

    return notifications;
}


module.exports = {
    getNotifications
};  