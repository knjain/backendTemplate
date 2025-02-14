const {appNotificationService, userService} = require('../services');
const catchAsync = require('../utils/catchAsync');
const {getPaginateConfig} = require('../utils/queryPHandler');

const notify = catchAsync(async (req, res) => {
  const {targetRole = null} = req.params; // For handling group notification
  const notification = await appNotificationService.createNotification({
    ...req.body,
    targetRole,
    isCreatedByAdmin: true,
  });
  res.status(201).json({data: notification});
});

const getNotifications = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query);
  options.sortBy = 'createdAt';
  options.sortOrder = 'desc';

  // Admin
  if (req.user.__t === 'Admin') {
    const notifications = await appNotificationService.getAdminNotifications(filters, options);
    return res.json({data: notifications});
  }

  // Other users
  const notifications = await appNotificationService.getNotifications(
    {
      $or: [{targetRole: {$in: ['All', req.user.__t]}}, {user: req.user._id}],
      scheduledAt: {$gte: req.user.createdAt},
    },
    options
  );
  res.json({data: notifications});
});

const getNotificationsSentByAdmin = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query);
  options.sortBy = 'createdAt';
  options.sortOrder = 'desc';
  const notifications = await appNotificationService.getNotifications({...filters, isCreatedByAdmin: true}, options);
  res.json({data: notifications});
});

const updateNotificationsLastSeenAt = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, {notificationsLastSeenAt: new Date()});
  res.json({data: user});
});

module.exports = {notify, getNotifications, getNotificationsSentByAdmin, updateNotificationsLastSeenAt};
