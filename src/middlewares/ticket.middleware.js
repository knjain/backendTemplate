const httpStatus = require('http-status');

const {ticketService} = require('../services/event');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const checkOwnership = catchAsync(async (req, res, next) => {
  const {ticketId} = req.params;
  const ticket = await ticketService.findTicketById(ticketId);
  if (!ticket.eventManager.equals(req.user._id))
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to perform this action');
  res.locals.ticket = ticket;
  next();
});

module.exports = {checkOwnership};
