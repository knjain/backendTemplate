const express = require('express');

const firebaseAuth = require('../../../middlewares/firebaseAuth');
const validate = require('../../../middlewares/validate');
const {eventBookingMiddleware} = require('../../../middlewares');
const {eventBookingValidation} = require('../../../validations/event');
const {eventBookingController} = require('../../../controllers/event');

const router = express.Router({mergeParams: true});

router.post(
  '/',
  firebaseAuth('StandardUser'),
  validate(eventBookingValidation.createBooking),
  eventBookingController.createBooking
);

router.get(
  '/',
  firebaseAuth('Admin,StandardUser,EventManager'),
  validate(eventBookingValidation.getBookings),
  eventBookingController.getBookings
);

router.get(
  '/:eventBookingId',
  firebaseAuth('EventManager,StandardUser'),
  validate(eventBookingValidation.getOneBooking),
  eventBookingMiddleware.checkUserAccess,
  eventBookingController.getOneBooking
);

router.patch(
  '/:eventBookingId/attended-status',
  firebaseAuth('TicketChecker'),
  validate(eventBookingValidation.updateAttendedStatus),
  eventBookingMiddleware.checkTicketCheckerAccess,
  eventBookingController.updateAttendedStatus
);

module.exports = router;
