const {User, StandardUser, EventManager, TicketChecker, Admin, RestaurantVendor, SalonOwner} = require('../models');

async function createUser(user) {
  return StandardUser.create(user);
}

async function createAdmin(user) {
  return Admin.create(user);
}

async function createEventManager(eventManager) {
  return EventManager.create(eventManager);
}

async function createTicketChecker(ticketChecker) {
  return TicketChecker.create(ticketChecker);
}

async function createRestaurantVendor(vendorDetails) {
  return RestaurantVendor.create(vendorDetails);
}

async function createSalonOwner(ownerDetails) {
  return SalonOwner.create(ownerDetails);
}

async function getUserByFirebaseUId(id) {
  return User.findOne({firebaseUid: id});
}

module.exports = {
  createUser,
  createAdmin,
  createSalonOwner,
  createEventManager,
  createTicketChecker,
  getUserByFirebaseUId,
  createRestaurantVendor,
};
