const mongoose = require('mongoose');

const {paginate} = require('../../plugins/paginate');

const ticketCheckerSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {timestamps: true}
);

ticketCheckerSchema.plugin(paginate);

module.exports = {
  ticketCheckerSchema,
};
