const httpStatus = require('http-status');
const {bookingService, restaurantService} = require('../../services/restaurant');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const {getPaginateConfig} = require('../../utils/queryPHandler');
const {compareStrs} = require('../../utils/lib');

const getBooking = catchAsync(async (req, res) => {
  const data = await bookingService.findBookingById(req.params.bookingId);
  const {bookedBy, restaurant} = data;

  if (
    req.user.__t !== 'Admin' &&
    !compareStrs(bookedBy._id, req.user._id) &&
    !compareStrs(restaurant.vendor, req.user._id)
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to access this');
  }
  res.status(200).send({data});
});

const getBookings = catchAsync(async (req, res) => {
  let {filters, options} = getPaginateConfig(req.query);
  if (req.user.__t === 'RestaurantVendor') {
    const restaurant = await restaurantService.getRestaurantByVendorId(req.user._id);
    filters.restaurant = restaurant._id;
  } else if (req.user.__t === 'StandardUser') {
    filters = {
      $or: [
        {
          bookedBy: req.user._id,
          userEmail: {$regex: req.user.email, $options: 'i'},
        },
      ],
    };
    options.populate = ['restaurant::name,thumbnail,address,location'];
  } else if (req.user.__t === 'Admin') {
    options.populate = ['restaurant::name,thumbnail,address,location'];
  }

  const data = await bookingService.getBookings(filters, options);
  res.status(200).send({data});
});

const createBooking = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.findRestaurantById(req.body.restaurant);
  if (!restaurant.availableForBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Restaurant is not available for booking');
  }
  const securityAmount = restaurant.security.amount;
  const data = await bookingService.createBooking({...req.body, bookedBy: req.user._id, securityAmount});
  res.status(201).send({data});
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const bookingDoc = await bookingService.findBookingById(req.params.bookingId);
  const {
    bookedBy: {_id: userId},
  } = bookingDoc;
  if (!compareStrs(bookingDoc.bookedBy._id, userId) && !compareStrs(bookingDoc.restaurant.vendor, req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sorry, you are not allowed to access this');
  }
  const data = await bookingService.updateBookingStatusById(req.params.bookingId, req.body.status);
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
