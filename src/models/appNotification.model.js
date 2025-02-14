const mongoose = require('mongoose');

const {paginate} = require('./plugins/paginate');

// ///////////////////////// BASE NOTIFICATION SCHEMA /////////////////////////
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

notificationSchema.plugin(paginate);

notificationSchema.virtual('status').get(function() {
  return new Date(this.scheduledAt) > new Date() ? 'scheduled' : 'sent';
});

// ///////////////////////// APP NOTIFICATION FOR USERS /////////////////////////
const appNotificationSchema = new mongoose.Schema({
  targetRole: {
    type: String,
    default: null,
    enum: ['All', 'StandardUser', 'EventManager', 'TicketChecker', 'RestaurantVendor', 'SalonOwner', null],
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  },
  isCreatedByAdmin: {
    type: Boolean,
    default: false,
  },
});

// ///////////////////////// NOTIFICATION FOR ADMINS /////////////////////////
const adminNotificationSchema = new mongoose.Schema({});

// ///////////////////////// MODELS & DISCRIMINATORS /////////////////////////
const Notification = mongoose.model('Notification', notificationSchema);
const AppNotification = Notification.discriminator('AppNotification', appNotificationSchema);
const AdminNotification = Notification.discriminator('AdminNotification', adminNotificationSchema);

module.exports = {AppNotification, AdminNotification};
