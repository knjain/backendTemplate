const express = require('express');

const validate = require('../../middlewares/validate');
const firebaseAuth = require('../../middlewares/firebaseAuth');
const {appNotificationValidation} = require('../../validations');
const {appNotificationController} = require('../../controllers');

const router = express.Router();

// Send group notification
router.post(
  '/notify-people/:targetRole',
  firebaseAuth('Admin'),
  validate(appNotificationValidation.notifyPeople),
  appNotificationController.notify
);

// Get notifications
router.get(
  '/',
  firebaseAuth('All'),
  validate(appNotificationValidation.getNotifications),
  appNotificationController.getNotifications
);

// Get notifications sent by admin
router.get(
  '/sent-by-admin',
  firebaseAuth('All'),
  validate(appNotificationValidation.getNotificationsSentByAdmin),
  appNotificationController.getNotificationsSentByAdmin
);

// Update notifications last seen at for current user
router.patch('/seen', firebaseAuth('All'), appNotificationController.updateNotificationsLastSeenAt);

module.exports = router;
