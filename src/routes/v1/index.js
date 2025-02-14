const express = require('express');
const router = express.Router();

const eventRoute = require('./event');
const salonRoute = require('./salon');
const restaurantRoute = require('./restaurant');

const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const ticketCheckerRoute = require('./ticketChecker.route');
const adminRoute = require('./admin.route');

const appNotificationRoute = require('./appNotification.route');
const platformSettingRoute = require('./platformSetting.route');

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/admin', adminRoute);
router.use('/salons', salonRoute);
router.use('/events', eventRoute);
router.use('/restaurants', restaurantRoute);
router.use('/notifications', appNotificationRoute);
router.use('/platform-settings', platformSettingRoute);
router.use('/ticket-checkers', ticketCheckerRoute);

module.exports = router;
