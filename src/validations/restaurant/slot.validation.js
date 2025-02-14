// const Joi = require("joi");
// // const {
// //   objectId,
// //   convertFieldToRegEx,
// //   dbOptionsSchema,
// // } = require("../custom.validation");

// const { dayNames } = require("../constants");
// const { objectId } = require("./custom.validation");

// const getSlotById = {};

// const getSlots = {
//   body: Joi.object().keys({}),
// };

// const createSlots = {
//   body: Joi.object().keys({
//     dayName: Joi.string()
//       .valid(...dayNames)
//       .required(),
//     category: Joi.string().required(),
//     slotDuration: Joi.number().required(),
//     startTime: Joi.string().required(),
//   }),
// };

// const updateSlot = {
//   body: Joi.object().keys({
//     dayName: Joi.array().valid(...dayNames),
//     category: Joi.string(),
//     slotDuration: Joi.number(),
//     startTime: Joi.string(),
//   }),
// };

// const deleteSlot = {
//   params: Joi.object().keys({
//     id: Joi.string().custom(objectId).required(),
//   }),
// };
