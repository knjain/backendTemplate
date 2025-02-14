const mongoose = require('mongoose');

const {paginate} = require('../plugins/paginate');

const eventSchema = new mongoose.Schema(
  {
    bookingsCount: {
      type: Number,
      default: 0,
    },
    attendeesCount: {
      type: Number,
      default: 0,
    },
    ticketChecker: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'TicketChecker',
      default: null,
    },
    thumbnail: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    slots: {
      type: [
        {
          startDate: {
            type: Date,
            required: true,
          },
          endDate: {
            type: Date,
            required: true,
          },
        },
      ],
      required: true,
    },
    venueDetails: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    availableForBooking: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'EventCategory',
      required: true,
    },
  },
  {timestamps: true}
);

eventSchema.plugin(paginate);

eventSchema.index({location: '2dsphere'});

module.exports.Event = mongoose.model('Event', eventSchema);
