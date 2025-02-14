const Joi = require("joi");
const {
  objectId,
  convertFieldToRegEx,
  dbOptionsSchema,
} = require("../custom.validation");
const { dayNames } = require("../../constants");

const getregularHrs = {
  params: Joi.object().keys({
    restaurantId: Joi.string().custom(objectId).required(),
  }),
};

const createregularHrs = {
  body: Joi.object().keys({
    schedule: Joi.array().items(
      Joi.object().keys({
        openTime: Joi.string().required(),
        closeTime: Joi.string().required(),
        closed: Joi.boolean(),
        dayName: Joi.string()
          .valid(...dayNames)
          .required(),
      })
    ),
  }),
};

const updateregularHrs = {
  body: Joi.object().keys({
    openTime: Joi.string(),
    closeTime: Joi.string(),
    closed: Joi.boolean(),
    dayName: Joi.string().valid(...dayNames),
  }),
};

// const getspecialHrsSchema = {
//   params: Joi.object().keys({
//     restaurantId: Joi.string().custom(objectId).required(),
//   }),
// };

// const createspecialHrsSchema = {
//   body: Joi.object().keys({
//     openTime: Joi.string().required(),
//     closeTime: Joi.string().required(),
//     closed: Joi.boolean(),
//     date: Joi.date().required(),
//   }),
// };

// const updatespecialHrsSchema = {
//   body: Joi.object().keys({
//     openTime: Joi.string(),
//     closeTime: Joi.string(),
//     closed: Joi.boolean(),
//     date: Joi.date(),
//   }),
// };

module.exports = {
  getregularHrs,
  createregularHrs,
  updateregularHrs,
  // getspecialHrsSchema,
  // createspecialHrsSchema,
  // updatespecialHrsSchema,
};
