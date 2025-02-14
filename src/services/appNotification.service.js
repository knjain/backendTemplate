const {AppNotification, AdminNotification} = require('../models');

const createNotification = data => AppNotification.create(data);

const createAdminNotification = data => AdminNotification.create(data);

const getNotifications = (filters, options) => AppNotification.paginate(filters, options);

const getAdminNotifications = (filters, options) => AdminNotification.paginate(filters, options);

module.exports = {createNotification, getNotifications, getAdminNotifications, createAdminNotification};
