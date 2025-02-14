const Joi = require('joi');
const {objectId, convertFieldToRegEx, dbOptionsSchema} = require('../custom.validation');
const {bookingStatusTypes} = require('../../constants');

const baseParams = {
  bookingId: Joi.string()
    .custom(objectId)
    .required(),
};

const getBookingById = {
  params: Joi.object().keys(baseParams),
};

const getBookings = {
  query: Joi.object().keys({
    ...dbOptionsSchema,
    userName: Joi.string()
      .trim()
      .custom(convertFieldToRegEx),
    userEmail: Joi.string()
      .lowercase()
      .email(),
    userPhone: Joi.string(),
    bookingDateTime: Joi.date()
      .iso()
      .custom(value => {
        const day = new Date(value);
        day.setHours(0, 0, 0, 0);
        const eod = new Date(day);
        eod.setHours(23, 59, 0, 0);
        return {
          $gte: new Date(day),
          $lte: new Date(eod),
        };
      }),
    restaurant: Joi.string().custom(objectId),
    status: Joi.string().valid(...bookingStatusTypes),
  }),
};

const createBooking = {
  body: Joi.object().keys({
    userName: Joi.string()
      .not('')
      .required(),
    userEmail: Joi.string()
      .lowercase()
      .email()
      .required(),
    userPhone: Joi.string()
      .not('')
      .required(),
    bookingDateTime: Joi.date()
      .iso()
      .required(),
    numberOfGuests: Joi.number().default(1),
    specialInstructions: Joi.string(),
    guests: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string()
          .lowercase()
          .email(),
        phone: Joi.string(),
      })
    ),
    restaurant: Joi.string()
      .custom(objectId)
      .required(),
  }),
};

const updateBookingStatus = {
  params: Joi.object()
    .keys(baseParams)
    .required(),
  body: Joi.object().keys({
    status: Joi.string()
      .valid('Rejected', 'Confirmed')
      .required(),
  }),
};

const cancelBooking = {
  params: Joi.object()
    .keys(baseParams)
    .required(),
};

module.exports = {
  cancelBooking,
  getBookingById,
  getBookings,
  createBooking,
  updateBookingStatus,
};
