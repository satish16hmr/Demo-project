const express = require('express');
const router = express.Router();
const notifyController = require('../controller/notify.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/getNotifications', authMiddleware.authentication, notifyController.getNotifications);

router.delete('/deleteNotification/:id', authMiddleware.authentication, notifyController.deleteNotification);


module.exports = router;