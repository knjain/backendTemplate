const {Booking} = require('../../models/restaurant');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

async function createBooking(eventObj) {
  return Booking.create(eventObj);
}
async function getBookings(filters, options) {
  return Booking.paginate(filters, options);
}
async function findBookingById(id) {
  const booking = await Booking.findById(id)
    .populate('bookedBy', '_id name profilePic __t')
    .populate('restaurant', '_id name vendor thumbnail');
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
}
async function updateBookingStatusById(id, status) {
  return Booking.findByIdAndUpdate(id, {status}, {new: true});
}
async function deleteBookingById(id) {
  return Booking.findByIdAndDelete(id);
}

module.exports = {
  createBooking,
  getBookings,
  findBookingById,
  updateBookingStatusById,
  deleteBookingById,
};
