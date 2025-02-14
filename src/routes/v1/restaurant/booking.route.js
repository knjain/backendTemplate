const express = require('express');
const router = express.Router({mergeParams: true});
const {bookingValidation} = require('../../../validations/restaurant');
const validate = require('../../../middlewares/validate');
const {bookingController} = require('../../../controllers/restaurant');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

// Create booking
router.post('/', firebaseAuth('All'), validate(bookingValidation.createBooking), bookingController.createBooking);

// Get all bookings
router.get(
  '/',
  validate(bookingValidation.getBookings),
  firebaseAuth('StandardUser,RestaurantVendor,Admin'),
  bookingController.getBookings
);

// Get a booking by id
router.get(
  '/:bookingId',
  firebaseAuth('Admin,User,RestaurantVendor'),
  validate(bookingValidation.getBookingById),
  bookingController.getBooking
);

router.patch(
  '/:bookingId',
  firebaseAuth('RestaurantVendor,StandardUser'),
  validate(bookingValidation.updateBookingStatus),
  bookingController.updateBookingStatus
);

router.patch(
  '/:bookingId/cancel',
  firebaseAuth('StandardUser'),
  validate(bookingValidation.cancelBooking),
  bookingController.cancelBooking
);

module.exports = router;
