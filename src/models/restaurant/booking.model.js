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
    },
    specialInstructions: {
      type: String,
      default: '',
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
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    securityAmount: {
      type: Number,
      required: true,
    },
  },
  {timestamps: true}
);

bookingSchema.plugin(paginate);

module.exports.Booking = mongoose.model('RestaurantBooking', bookingSchema);
