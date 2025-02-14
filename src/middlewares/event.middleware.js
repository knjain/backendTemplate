const httpStatus = require('http-status');

const {eventService} = require('../services/event');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const checkOwnership = catchAsync(async (req, res, next) => {
  const {eventId} = req.params;
  const event = await eventService.getEventById(eventId);
  if (!event.createdBy._id.equals(req.user._id))
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to perform this action');
  res.locals.event = event;
  next();
});

module.exports = {checkOwnership};
