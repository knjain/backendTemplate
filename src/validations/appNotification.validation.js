const Joi = require('joi');

const {dbOptionsSchema} = require('./custom.validation');

const baseNotificationSchema = Joi.object().keys({
  title: Joi.string()
    .trim()
    .required(),
  description: Joi.string().trim(),
  scheduledAt: Joi.date()
    .min('now')
    .default(() => new Date()),
});

const getNotifications = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
  }),
};

const getNotificationsSentByAdmin = getNotifications;

const notifyPeople = {
  params: {
    targetRole: Joi.string().valid(
      'All',
      'StandardUser',
      'EventManager',
      'TicketChecker',
      'RestaurantVendor',
      'SalonOwner'
    ),
  },
  body: baseNotificationSchema,
};

module.exports = {
  getNotifications,
  getNotificationsSentByAdmin,
  notifyPeople,
};
