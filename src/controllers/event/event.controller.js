const httpStatus = require('http-status');

const {eventService, categoryService} = require('../../services/event');
const {fileUploadService} = require('../../microservices');
const {getPaginateConfig} = require('../../utils/queryPHandler');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const createEvent = catchAsync(async (req, res) => {
  const [thumbnail] = await fileUploadService.s3Upload([req.file], 'events');

  if (!(await categoryService.verifyCategories(req.body.categories)))
    throw new ApiError(httpStatus.BAD_REQUEST, "We couldn't find some of the categories. Reach out to support team");

  const event = await eventService.createEvent({
    ...req.body,
    createdBy: req.user._id,
    thumbnail,
    location: {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    },
  });

  res.status(201).json({data: event});
});

const publishEvent = catchAsync(async (req, res) => {
  let {event} = res.locals;

  if (event.isPublished) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event is already published.');
  }
  event = await eventService.publishEvent(event);
  res.json({data: event});
});

const updateEventAvailability = catchAsync(async (req, res) => {
  let {event} = res.locals;

  if (!event.availableForBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Booking Availability is already set to false.');
  }
  event = await eventService.updateEventAvailability(event._id);
  res.json({message: 'Event Availability updated successfully.', data: event});
});

const assignTicketChecker = catchAsync(async (req, res) => {
  const {eventId} = req.params;
  const updatedEvent = await eventService.assignTicketChecker(eventId, req.body.ticketChecker);
  res.json({data: updatedEvent});
});

const getEvents = catchAsync(async (req, res) => {
  const {options, filters: queryFilters} = getPaginateConfig(req.query);
  options.populate = ['createdBy::email,name,bio,companyName,companyThumbnail'];
  const {longitude, latitude, radius, ...filters} = queryFilters;

  const location = longitude && latitude ? {latitude, longitude, radius} : null;

  if (filters.tags && filters.tags.length > 0) {
    filters.tags = {$in: filters.tags};
  }

  if (filters.date) {
    const startOfDay = new Date(filters.date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(filters.date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    filters.slots = {
      $elemMatch: {
        startDate: {$gte: startOfDay, $lt: endOfDay},
      },
    };

    delete filters.date;
  }

  if (location) {
    const events = await eventService.getEvents(filters, options, location);
    return res.json({data: events});
  }

  if (filters.address) {
    filters.$or = [
      {address: filters.address},
      {city: filters.address},
      {address: filters.address},
      {venueDetails: filters.address},
    ];
    delete filters.address;
  } else if (filters.search) {
    filters.$or = [{title: filters.search}, {description: filters.search}];
  }
  if (req.user.__t === 'StandardUser') {
    filters.isPublished = true;
  }
  if (req.user.__t === 'EventManager') {
    filters.createdBy = req.user._id;
  }
  const events = await eventService.getEvents(filters, options);
  res.json({data: events});
});

const getOneEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);
  res.json({data: event});
});

const getTicketCheckerEvents = catchAsync(async (req, res) => {
  const {options, filters} = getPaginateConfig(req.query);

  if (filters.keyword) {
    filters.$or = [{address: filters.keyword}, {title: filters.keyword}];
    delete filters.keyword;
  }

  const events = await eventService.getEvents({...filters, ticketChecker: req.user._id}, options);
  res.json({data: events});
});

const deleteEvent = catchAsync(async (req, res) => {
  if (res.locals.event.isPublished) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Event is published and cannot be deleted now.');
  }
  await eventService.deleteEventById(req.params.eventId);
  res.status(200).send({message: 'Event is deleted successfully'});
});

module.exports = {
  createEvent,
  publishEvent,
  getEvents,
  assignTicketChecker,
  getTicketCheckerEvents,
  getOneEvent,
  updateEventAvailability,
  deleteEvent,
};
