const mongoose = require('mongoose');

const {paginate} = require('../plugins/paginate');

const eventBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  eventManager: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'EventManager',
    required: true,
  },
  event: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Event',
    required: true,
  },
  slot: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  ticketName: {
    type: String,
    required: true,
  },
  ticketPrice: {
    type: {
      value: Number,
      currency: String,
    },
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  qrCodeUrl: {
    type: String,
    default: null,
  },
});

eventBookingSchema.plugin(paginate);

const EventBooking = mongoose.model('EventBooking', eventBookingSchema);

module.exports = {EventBooking};
