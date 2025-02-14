const httpStatus = require('http-status');
const {bookingService, salonService} = require('../../services/salon');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const {compareStrs} = require('../../utils/lib');
const {getPaginateConfig} = require('../../utils/queryPHandler');

const getBooking = catchAsync(async (req, res) => {
  const data = await bookingService.findBookingById(req.params.bookingId);
  const {bookedBy, salon} = data;
  if (req.user.__t !== 'Admin' && !compareStrs(bookedBy._id, req.user._id) && !compareStrs(salon.owner, req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to access this');
  }
  res.status(200).send({data});
});

const getBookings = catchAsync(async (req, res) => {
  let {filters, options} = getPaginateConfig(req.query);
  if (req.user.__t === 'SalonOwner') {
    const salon = await salonService.getSalonByOwnerId(req.user._id);
    filters.salon = salon._id;
  } else if (req.user.__t === 'StandardUser') {
    filters = {
      $or: [
        {
          bookedBy: req.user._id,
          userEmail: {$regex: req.user.email, $options: 'i'},
        },
      ],
    };
    options.populate = ['salon::name,thumbnail,address,location', 'services::_id,name,image'];
  } else if (req.user.__t === 'Admin') {
    options.populate = ['salon::name,thumbnail,address,location', 'services::_id,name,image'];
  }
  const data = await bookingService.getBookings(filters, options);
  res.status(200).send({data});
});

const createBooking = catchAsync(async (req, res) => {
  const salon = await salonService.findSalonById(req.body.salon);
  if (!salon.availableForBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Salon is not available for booking');
  }
  const securityAmount = salon.security.amount;
  const data = await bookingService.createBooking({...req.body, bookedBy: req.user._id, securityAmount});
  res.status(201).send({data});
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const {bookingId} = req.params;
  const bookingDoc = await bookingService.findBookingById(bookingId);
  const {
    bookedBy: {_id: userId},
  } = bookingDoc;
  if (!compareStrs(bookingDoc.bookedBy._id, userId) && !compareStrs(bookingDoc.salon.owner, req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to access this');
  }
  const data = await bookingService.updateBookingStatusById(bookingId, req.body.status);
  res.status(200).send({data});
});

const cancelBooking = catchAsync(async (req, res) => {
  const {bookingId} = req.params;
  const bookingDoc = await bookingService.findBookingById(bookingId);
  const {
    bookedBy: {_id: userId},
  } = bookingDoc;
  if (!compareStrs(bookingDoc.bookedBy._id, userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to access this');
  }
  const data = await bookingService.updateBookingStatusById(bookingId, 'Cancelled');
  res.status(200).send({data});
});

module.exports = {
  cancelBooking,
  getBooking,
  getBookings,
  createBooking,
  updateBookingStatus,
};
