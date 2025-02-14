const httpStatus = require('http-status');

const {bookingService, eventService} = require('../services/event');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const checkEventManagerAccess = catchAsync(async (req, res, next) => {
  const {eventBookingId} = req.params;
  const eventBooking = await bookingService.getEventBookingById(eventBookingId);
  if (!eventBooking.eventManager.equals(req.user._id))
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to perform this action');

  res.locals.eventBooking = eventBooking;
  next();
});

const checkTicketCheckerAccess = catchAsync(async (req, res, next) => {
  const {eventBookingId} = req.params;
  const eventBooking = await bookingService.getEventBookingById(eventBookingId);

  const event = await eventService.getEventById(eventBooking.event);
  if (!event.ticketChecker?.equals(req.user._id))
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to perform this action');

  res.locals.eventBooking = eventBooking;
  res.locals.event = event;
  next();
});

const checkUserAccess = catchAsync(async (req, res, next) => {
  const {eventBookingId} = req.params;
  const eventBooking = await bookingService.getEventBookingById(eventBookingId, true);
  if (!eventBooking.user._id.equals(req.user._id))
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to perform this action');

  res.locals.eventBooking = eventBooking;
  next();
});

module.exports = {checkEventManagerAccess, checkTicketCheckerAccess, checkUserAccess};
