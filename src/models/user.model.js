const mongoose = require('mongoose');

const {paginate} = require('./plugins/paginate');
const {userSchemas} = require('./schemas');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: {
        key: String,
        url: String,
      },
    },
    firebaseUid: {
      type: String,
      default: null,
    },
    firebaseSignInProvider: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      notificationEnabled: {
        type: Boolean,
        default: false,
      },
    },
    notificationsLastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {timestamps: true}
);

userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
const StandardUser = User.discriminator('StandardUser', new mongoose.Schema({}));
const Admin = User.discriminator('Admin', userSchemas.adminSchema);
const EventManager = User.discriminator('EventManager', userSchemas.eventManagerSchema);
const TicketChecker = User.discriminator('TicketChecker', userSchemas.ticketCheckerSchema);
const RestaurantVendor = User.discriminator('RestaurantVendor', new mongoose.Schema({}, {timestamps: true}));
const SalonOwner = User.discriminator('SalonOwner', new mongoose.Schema({}, {timestamps: true}));

module.exports = {
  User,
  Admin,
  SalonOwner,
  StandardUser,
  EventManager,
  TicketChecker,
  RestaurantVendor,
};
