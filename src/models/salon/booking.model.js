const {default: mongoose} = require('mongoose');
const {paginate} = require('../plugins/paginate');
const {bookingStatusTypes} = require('../../constants');

const bookingSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      default: null,
    },
    userPhone: {
      type: String,
      default: null,
    },
    bookingDateTime: {
      type: Date,
      required: true,
    },
    guests: {
      type: [
        {
          name: String,
          email: String,
          phone: String,
        },
      ],
      default: [],
    },
    numberOfGuests: {
      type: Number,
      default: 1,
      max: 2,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: bookingStatusTypes,
      default: 'Pending',
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    services: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'SalonCatalogue',
      required: true,
    },
    specialInstructions: {
      type: String,
      default: null,
    },
    securityAmount: {
      type: Number,
      required: true,
    },
  },
  {timestamps: true}
);

bookingSchema.plugin(paginate);

module.exports.Booking = mongoose.model('SalonBooking', bookingSchema);
