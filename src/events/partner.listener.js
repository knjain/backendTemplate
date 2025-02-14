const {Salon, Restaurant, User, EventManager} = require('../models');
const userService = require('../services/user.service');

const handleEventManagerRejection = async ({user}) => {
  await userService.markUserAsDeletedById(user._id);
};

const handleSalonOwnerRejection = async ({user}) => {
  await Promise.allSettled([userService.markUserAsDeletedById(user._id), Salon.findOneAndDelete({owner: user._id})]);
};

const handleRestaurantVendorRejection = async ({user}) => {
  await Promise.allSettled([
    userService.markUserAsDeletedById(user._id),
    Restaurant.findOneAndDelete({vendor: user._id}),
  ]);
};

const handleRestaurantVendorSuspension = async ({user}) => {
  const userId = user._id;
  await Promise.allSettled([
    Restaurant.findOneAndUpdate({vendor: userId}, {status: 'Suspended'}, {new: true}),
    User.findByIdAndUpdate(userId, {isBlocked: true}),
  ]);
};

const handleEventManagerSuspension = async ({user}) => {
  const userId = user._id;
  await EventManager.findOneAndUpdate({_id: userId}, {status: 'Suspended', isBlocked: true}, {new: true});
};

const handleSalonOwnerSuspension = async ({user}) => {
  const userId = user._id;
  await Promise.allSettled([
    Salon.findOneAndUpdate({owner: userId}, {status: 'Suspended'}, {new: true}),
    User.findByIdAndUpdate(userId, {isBlocked: true}),
  ]);
};

module.exports = {
  handleEventManagerRejection,
  handleSalonOwnerRejection,
  handleRestaurantVendorRejection,
  handleRestaurantVendorSuspension,
  handleEventManagerSuspension,
  handleSalonOwnerSuspension,
};
