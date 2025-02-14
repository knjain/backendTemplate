const httpStatus = require('http-status');
const {bookingService} = require('../../services/event');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const {getPaginateConfig} = require('../../utils/queryPHandler');

const createBooking = catchAsync(async (req, res) => {
  const data = await bookingService.createEventBooking(req.user._id, req.params.eventId, req.body);
  res.status(201).json({data});
});

const getBookings = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query);
  options.populate = [
    'user::name,profilePic,email',
    'eventManager::companyName,companyThumbnail,email',
    'event::title,description,location,venueDetails,isPublished,thumbnail',
  ];
  if (req.user.__t === 'StandardUser') {
    filters.user = req.user._id;
    delete filters.event;
  } else if (req.user.__t === 'EventManager') filters.eventManager = req.user._id;

  const data = await bookingService.getEventBookings(filters, options);
  res.json({data});
});

const getOneBooking = catchAsync(async (req, res) => {
  res.json({data: res.locals.eventBooking});
});

const updateAttendedStatus = catchAsync(async (req, res) => {
  const {eventBooking} = res.locals;
  if (eventBooking.attended) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Ticket has already been scanned');
  }
  const data = await bookingService.updateAttendedStatus(eventBooking);
  res.json({data});
});

module.exports = {createBooking, getBookings, getOneBooking, updateAttendedStatus};
