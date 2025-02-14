const express = require('express');

const firebaseAuth = require('../../middlewares/firebaseAuth');
const validate = require('../../middlewares/validate');

const {ticketCheckerValidation} = require('../../validations/event');
const {ticketCheckerController} = require('../../controllers/event');

const router = express.Router();

router.post(
  '/',
  firebaseAuth('EventManager'),
  validate(ticketCheckerValidation.createTicketChecker),
  ticketCheckerController.createTicketChecker
);

router.get(
  '/',
  firebaseAuth('EventManager,Admin'),
  validate(ticketCheckerValidation.getTicketCheckers),
  ticketCheckerController.getTicketCheckers
);

module.exports = router;
