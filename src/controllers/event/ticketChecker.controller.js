const admin = require('firebase-admin');

const catchAsync = require('../../utils/catchAsync');
const {getPaginateConfig} = require('../../utils/queryPHandler');
const {ticketCheckerService} = require('../../services/event');

const getTicketCheckers = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query);

  if (req.user.__t === 'EventManager') {
    filters.createdBy = req.user._id;
  }

  const ticketCheckers = await ticketCheckerService.getTicketCheckers(filters, options);
  res.json({data: ticketCheckers});
});

const createTicketChecker = catchAsync(async (req, res) => {
  const firebaseUser = await admin.auth().createUser({
    email: req.body.email,
    displayName: req.body.name,
    phoneNumber: req.body.phone,
  });

  const ticketChecker = await ticketCheckerService.createTicketChecker({
    ...req.body,
    firebaseUid: firebaseUser.uid,
    createdBy: req.user._id,
  });

  res.status(201).json({data: ticketChecker});
});

module.exports = {getTicketCheckers, createTicketChecker};
