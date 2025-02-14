const mongoose = require('mongoose');

const {paginate} = require('../plugins/paginate');

const eventTicketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Event',
      required: true,
    },
    eventManager: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: {
        value: Number,
        currency: String,
      },
      required: true,
    },
    availableCount: {
      type: Number,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

eventTicketSchema.plugin(paginate);

eventTicketSchema.index({event: 1, name: 1}, {unique: true});

const EventTicket = mongoose.model('EventTicket', eventTicketSchema);

module.exports.EventTicket = EventTicket;
