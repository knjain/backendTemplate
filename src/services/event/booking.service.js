const httpStatus = require('http-status');

const ticketService = require('./ticket.service');
const eventService = require('./event.service');
const {EventBooking} = require('../../models');
const ApiError = require('../../utils/ApiError');
const {emitter} = require('../../events/eventEmitter');
const {eventNames} = require('../../constants');
const {generateQRCode} = require('../../utils/qrCodeGenerator');
const createEventBooking = async (userId, eventId, payload) => {
  const {ticket: ticketId, ...body} = payload;

  const [ticket, event] = await Promise.all([
    ticketService.findTicketById(ticketId),
    eventService.getEventById(eventId),
  ]);

  if (!event.availableForBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This event is not available for booking.');
  }

  if (!ticket.event.equals(event._id))
    throw new ApiError(httpStatus.BAD_REQUEST, 'The provided ticket does not belong to this event');

  // Check if ticket is available
  if (!ticket.isEnabled || ticket.availableCount <= 0)
    throw new ApiError(httpStatus.CONFLICT, `Ticket ${ticket.name} is currently unavailable`);

  const eventBooking = await EventBooking.create({
    ...body,
    event: eventId,
    ticketName: ticket.name,
    ticketPrice: ticket.price,
    eventManager: event.createdBy?._id,
    user: userId,
  }).then(async doc => {
    return generateQRCode(doc._id.toString()).then(qrCodeUrl => {
      doc.qrCodeUrl = qrCodeUrl;
      return doc.save();
    });
  });
  emitter.emit(eventNames.EVENT_BOOKING_CREATED, {event, ticket});

  return eventBooking;
};

const getEventBookings = (filters, options) => EventBooking.paginate(filters, options);

const getEventBookingById = async (id, populateReferences = false) => {
  let query = EventBooking.findById(id);
  if (populateReferences)
    query = query.populate([
      {
        path: 'user',
        select: 'name profilePic email',
      },
      {
        path: 'eventManager',
        select: 'companyName companyThumbnail email',
      },
      {
        path: 'event',
        select: 'slots title description location venueDetails isPublished thumbnail',
      },
    ]);
  const eventBooking = await query;
  if (!eventBooking) throw new ApiError(httpStatus.NOT_FOUND, `Could not find a booking with id ${id}`);
  return eventBooking;
};

const updateBooking = (id, data) => EventBooking.findByIdAndUpdate(id, data, {new: true, runValidators: true});

const deleteBooking = id => EventBooking.findByIdAndDelete(id);

async function updateAttendedStatus(eventBooking) {
  await updateBooking(eventBooking._id, {attended: true}).then(() => {
    emitter.emit(eventNames.EVENT_TICKET_SCANNED, {eventBooking});
  });
}

module.exports = {
  createEventBooking,
  getEventBookings,
  getEventBookingById,
  updateBooking,
  deleteBooking,
  updateAttendedStatus,
};
