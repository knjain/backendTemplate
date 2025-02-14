const Joi = require("joi");
const { objectId } = require("../custom.validation");

const baseSchema = {
  phone: Joi.string().required(),
  verified: Joi.boolean().required(),
};

const addContact = {
  body: Joi.object().keys({
    newphones: Joi.array().items(Joi.object().keys(baseSchema)).min(1),
  }),
};

const deleteContact = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateContact = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys(baseSchema),
};

module.exports = {
  addContact,
  deleteContact,
  updateContact,
};
