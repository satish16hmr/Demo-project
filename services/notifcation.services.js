const Notification = require('../model/notification.model');

async function createNotification({ userId, fromUserId, type, message }) {
    console.log('Creating notification:', { userId, fromUserId, type, message });
    return Notification.create({
        userId,
        fromUserId,
        type,
        message,
    });
}

module.exports = { createNotification };