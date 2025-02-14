const express = require('express');

const firebaseAuth = require('../../../middlewares/firebaseAuth');
const validate = require('../../../middlewares/validate');

const {eventValidation} = require('../../../validations/event');
const {eventController} = require('../../../controllers/event');
const {eventMiddleware} = require('../../../middlewares');
const {fileUploadService} = require('../../../microservices');

const eventTicketRoute = require('./ticket.route');
const eventBookingRoute = require('./booking.route');
const eventCategoryRoute = require('./category.route');

const router = express.Router();

// Mounting routers
router.use('/bookings', eventBookingRoute);
router.use('/:eventId/bookings', eventBookingRoute);

router.use('/:eventId/tickets', eventTicketRoute);

router.use('/categories', eventCategoryRoute);

router.post(
  '/',
  firebaseAuth('EventManager'),
  fileUploadService.multerUpload.single('thumbnail'),
  validate(eventValidation.createEvent),
  eventController.createEvent
);

router.patch(
  '/:eventId/status',
  firebaseAuth('EventManager'),
  validate(eventValidation.updatePublishedStatus),
  eventMiddleware.checkOwnership,
  eventController.publishEvent
);

router.patch(
  '/:eventId/availability',
  firebaseAuth('EventManager'),
  eventMiddleware.checkOwnership,
  validate(eventValidation.updateEventAvailability),
  eventController.updateEventAvailability
);

router.patch(
  '/:eventId/assign',
  firebaseAuth('EventManager'),
  validate(eventValidation.assignTicketChecker),
  eventMiddleware.checkOwnership,
  eventController.assignTicketChecker
);

router.get('/', firebaseAuth('All'), validate(eventValidation.getEvents), eventController.getEvents);

router.get(
  '/ticket-checker-events',
  firebaseAuth('TicketChecker'),
  validate(eventValidation.getTicketCheckerEvents),
  eventController.getTicketCheckerEvents
);

router.get('/:eventId', firebaseAuth('All'), validate(eventValidation.getOneEvent), eventController.getOneEvent);

router.delete(
  '/:eventId',
  firebaseAuth('EventManager'),
  eventMiddleware.checkOwnership,
  validate(eventValidation.getOneEvent),
  eventController.deleteEvent
);

module.exports = router;
