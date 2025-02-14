const httpStatus = require('http-status');
const {EventTicket} = require('../../models');
const ApiError = require('../../utils/ApiError');
const {emitter} = require('../../events/eventEmitter');
const {eventNames} = require('../../constants');

const findEventTicketByName = async (eventId, name) => {
  return EventTicket.findOne({
    event: eventId,
    name: {$regex: new RegExp(`^${name}$`, 'i')},
  });
};

async function createTicket(ticket) {
  return EventTicket.create(ticket);
}

async function findTicketsByEventId(eventId) {
  return EventTicket.find({event: eventId});
}

async function findTicketById(id) {
  const ticket = await EventTicket.findById(id);
  if (!ticket) throw new ApiError(httpStatus.NOT_FOUND, `Ticket with id ${id} does not exist`);
  return ticket;
}

async function updateTicketById(id, ticket) {
  return EventTicket.findByIdAndUpdate(id, ticket, {
    new: true,
    runValidators: true,
  });
}

async function getAllTickets(options) {
  return EventTicket.paginate({}, options);
}

async function deleteTicketById(id) {
  return EventTicket.findByIdAndDelete(id).then(doc => {
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    }
  });
}

module.exports = {
  createTicket,
  getAllTickets,
  findTicketById,
  updateTicketById,
  findTicketsByEventId,
  findEventTicketByName,
  deleteTicketById,
};
