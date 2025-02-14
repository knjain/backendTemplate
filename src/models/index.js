const {User, StandardUser, Admin, EventManager, TicketChecker, RestaurantVendor, SalonOwner} = require('./user.model');
const {EventCategory} = require('./events/eventCategory.model');
const {Event} = require('./events/event.model');
const {EventTicket} = require('./events/eventTicket.model');
const {EventBooking} = require('./events/booking.model');
const {AppNotification, AdminNotification} = require('./appNotification.model');
const {PlatformSetting} = require('./platformSetting.model');
const {Salon} = require('./salon/salon.model');
const {Restaurant} = require('./restaurant/restaurant.model');
const {LocationSearchHistory} = require('./locationSearchHistory.model');
module.exports = {
  User,
  StandardUser,
  Admin,
  SalonOwner,
  RestaurantVendor,
  EventManager,
  TicketChecker,
  EventCategory,
  Event,
  EventTicket,
  AppNotification,
  AdminNotification,
  PlatformSetting,
  EventBooking,
  Salon,
  Restaurant,
  LocationSearchHistory,
};
