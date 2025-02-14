const express = require('express');
const router = express.Router();

const {bookingValidation} = require('../../../validations/salon');
const {bookingController} = require('../../../controllers/salon');
const {fileUploadService} = require('../../../microservices');

const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

router.get('/', firebaseAuth('All'), validate(bookingValidation.getBookings), bookingController.getBookings);
router.get(
  '/:bookingId',
  firebaseAuth('All'),
  validate(bookingValidation.getBookingById),
  bookingController.getBooking
);

router.post(
  '/',
  fileUploadService.multerUpload.single('profilePic'),
  firebaseAuth('All'),
  validate(bookingValidation.createBooking),
  bookingController.createBooking
);

router.patch(
  '/:bookingId',
  firebaseAuth('SalonOwner,StandardUser'),
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
