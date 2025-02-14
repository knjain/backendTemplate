const express = require('express');

const firebaseAuth = require('../../../middlewares/firebaseAuth');
const validate = require('../../../middlewares/validate');
const {eventMiddleware, ticketMiddleware} = require('../../../middlewares');
const {eventTicketValidation} = require('../../../validations/event');
const {eventTicketController} = require('../../../controllers/event');

const router = express.Router({mergeParams: true});

// POST /events/:eventId/tickets
router.post(
  '/',
  firebaseAuth('EventManager'),
  validate(eventTicketValidation.createEventTicket),
  eventMiddleware.checkOwnership,
  eventTicketController.createEventTicket
);

// GET /events/:eventId/tickets
router.get(
  '/',
  firebaseAuth('All'),
  validate(eventTicketValidation.getTickets),
  eventTicketController.getTicketsOfEvent
);

// PATCH /events/:eventId/tickets/:ticketId
router.patch(
  '/:ticketId',
  firebaseAuth('EventManager'),
  validate(eventTicketValidation.updateTicket),
  ticketMiddleware.checkOwnership,
  eventTicketController.updateTicket
);

router.delete(
  '/:ticketId',
  firebaseAuth('EventManager'),
  validate(eventTicketValidation.deleteTicket),
  ticketMiddleware.checkOwnership,
  eventTicketController.deleteTicket
);

module.exports = router;
