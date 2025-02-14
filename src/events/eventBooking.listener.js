const {userService} = require('../services');
const {eventService, ticketService} = require('../services/event');

const onEventBookingCreated = async ({event, ticket}) => {
   await Promise.allSettled([
    userService.updateEventManagerById(event.createdBy, {$inc: {earnings: ticket.price.value}}),
    eventService.updateEventById(event._id, {$inc: {bookingsCount: 1}}),
    ticketService.updateTicketById(ticket._id, {$inc: {availableCount: -1}}),
  ]);
};

const onBookingStatusChange = async ({eventBooking}) => {
  await eventService.updateEventById(eventBooking.event, {$inc: {attendeesCount: 1}});
};



module.exports = {onEventBookingCreated, onBookingStatusChange};
