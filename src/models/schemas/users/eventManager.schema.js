const mongoose = require('mongoose');

const {paginate} = require('../../plugins/paginate');
const {partnerStatusTypes} = require('../../../constants');

const eventManagerSchema = new mongoose.Schema(
  {
    earnings: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: '',
    },
    businessId: {
      type: String,
      required: true,
    },
    businessDoc: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
    taxPayId: {
      type: String,
      required: true,
    },
    categories: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'EventCategory',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyThumbnail: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
    companyImages: {
      type: [
        {
          key: String,
          url: String,
        },
      ],
      default: [],
    },
    totalEvents: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: partnerStatusTypes,
      default: 'Pending',
    },
  },
  {timestamps: true}
);

eventManagerSchema.plugin(paginate);

module.exports = {
  eventManagerSchema,
};
