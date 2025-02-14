const {eventNames} = require('../constants');
const {emitter} = require('./eventEmitter');

const eventBookingListener = require('./eventBooking.listener');
const partnerListener = require('./partner.listener');
const eventPublish = require('./eventPublish.listener');
emitter.on(eventNames.EVENT_BOOKING_CREATED, eventBookingListener.onEventBookingCreated);
emitter.on(eventNames.EVENT_TICKET_SCANNED, eventBookingListener.onBookingStatusChange);
emitter.on(eventNames.EVENT_COUNT_FOR_EVENT_MANAGER, eventPublish.onEventPublish);

emitter.on(eventNames.eventManager.rejection, partnerListener.handleEventManagerRejection);
emitter.on(eventNames.salonOwner.rejection, partnerListener.handleSalonOwnerRejection);
emitter.on(eventNames.restaurantVendor.rejection, partnerListener.handleRestaurantVendorRejection);

emitter.on(eventNames.eventManager.suspension, partnerListener.handleEventManagerSuspension);
emitter.on(eventNames.salonOwner.suspension, partnerListener.handleSalonOwnerSuspension);
emitter.on(eventNames.restaurantVendor.suspension, partnerListener.handleRestaurantVendorSuspension);

module.exports.initializeListeners = () => {
  console.log('Event Listeners are running now');
};
