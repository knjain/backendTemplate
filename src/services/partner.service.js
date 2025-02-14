//     {$set: {status: 'Active'}},

const httpStatus = require('http-status');
const {eventNames} = require('../constants');
const {Salon, Restaurant, EventManager, User} = require('../models');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const {emailService} = require('../microservices');
const {emitter} = require('../events/eventEmitter');

const partnerConfig = {
  EventManager: {model: EventManager, field: '_id', events: eventNames.eventManager},
  SalonOwner: {model: Salon, field: 'owner', events: eventNames.salonOwner},
  RestaurantVendor: {
    model: Restaurant,
    field: 'vendor',
    events: eventNames.restaurantVendor,
  },
};

async function getParnterById(id) {
  const user = await userService.getUserById(id);
  const config = partnerConfig[user.__t];
  if (!config) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unknown partner type.');
  }
  return {user, config};
}

async function rejectPartnerById(partnerId, reason) {
  const {user, config} = await getParnterById(partnerId);
  await emailService.sendEmail(user.email, 'Registration Rejected', reason).then(() => {
    emitter.emit(config.events.rejection, {user});
  });
}

async function activatePartnerById(partnerId) {
  const {user, config} = await getParnterById(partnerId);
  await Promise.all([
    config.model.findOneAndUpdate({[config.field]: user._id}, {status: 'Active'}, {new: true}),
    User.findByIdAndUpdate(partnerId, {isBlocked: false}),
  ]);
}

async function suspendParnterById(partnerId, reason) {
  const {user, config} = await getParnterById(partnerId);
  await emailService.sendEmail(user.email, 'Suspension Notice', reason).then(async () => {
    emitter.emit(config.events.suspension, {user});
  });
}

module.exports = {rejectPartnerById, activatePartnerById, suspendParnterById};
