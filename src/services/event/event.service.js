const httpStatus = require('http-status');

const ticketCheckerService = require('./ticketChecker.service');
const {Event, EventTicket} = require('../../models');
const ApiError = require('../../utils/ApiError');
const {emitter} = require('../../events/eventEmitter');
const {eventNames} = require('../../constants');

async function createEvent(eventObj) {
  return Event.create(eventObj);
}

async function getEventById(id) {
  const doc = await Event.findById(id).populate('createdBy', 'email name bio companyName companyThumbnail');
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  return doc;
}

async function getEvents(filters, options) {
  return Event.paginate(filters, options);
}

async function updateEventById(id, eventUpdates) {
  return Event.findByIdAndUpdate(id, eventUpdates, {
    new: true,
  });
}

async function publishEvent(event) {
  return updateEventById(event._id, {isPublished: true, availableForBooking: true}).then(() => {
    emitter.emit(eventNames.EVENT_COUNT_FOR_EVENT_MANAGER, {event});
  });
}

async function updateEventAvailability(eventId) {
  return updateEventById(eventId, {availableForBooking: false});
}

async function getEventsCountCreatedBy(userId) {
  return Event.countDocuments({createdBy: userId});
}

async function deleteEventById(id) {
  return Event.findByIdAndDelete(id).then(doc => {
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    return EventTicket.deleteMany({event: id});
  });
}

async function assignTicketChecker(eventId, ticketCheckerId) {
  const ticketChecker = await ticketCheckerService.getTicketCheckerById(ticketCheckerId);
  const updatedEvent = await updateEventById(eventId, {ticketChecker: ticketChecker._id});
  return updatedEvent;
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  getEventsCountCreatedBy,
  assignTicketChecker,
  publishEvent,
  updateEventAvailability,
};
