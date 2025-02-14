const catchAsync = require('../../utils/catchAsync');
const {ticketService} = require('../../services/event');

const createEventTicket = catchAsync(async (req, res) => {
  const {event} = res.locals;
  const eventTicket = await ticketService.createTicket({
    ...req.body,
    event: event._id,
    eventManager: event.createdBy._id,
  });
  res.status(201).json({data: eventTicket});
});

const getTicketsOfEvent = catchAsync(async (req, res) => {
  const {eventId} = req.params;
  const tickets = await ticketService.findTicketsByEventId(eventId);
  res.json({data: tickets});
});

const updateTicket = catchAsync(async (req, res) => {
  const {ticketId} = req.params;
  const updatedTicket = await ticketService.updateTicketById(ticketId, req.body);
  res.json({data: updatedTicket});
});

const deleteTicket = catchAsync(async (req, res) => {
  const {ticketId} = req.params;
  await ticketService.deleteTicketById(ticketId);
  res.status(204).send();
});

module.exports = {createEventTicket, getTicketsOfEvent, updateTicket, deleteTicket};
