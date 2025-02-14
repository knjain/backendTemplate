const mongoose = require('mongoose');
const {paginate} = require('../plugins/paginate');
const {regularHrsSchema, specialHrsSchema, bookingSlotsShema} = require('../schemas/salon');
const {partnerStatusTypes} = require('../../constants');

const salonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: '',
    },
    thumbnail: {
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
    images: {
      type: [
        {
          key: String,
          url: String,
        },
      ],
      default: [],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'SalonCategory',
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    availableForBooking: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    security: {
      amount: {
        type: Number,
        default: 0,
      },
      message: {
        type: String,
        default: '',
      },
      applicable: {
        type: Boolean,
        default: false,
      },
    },
    specialInstructions: {
      type: String,
      default: '',
    },
    regularHrs: regularHrsSchema,
    specialHrs: specialHrsSchema,
    availableSlots: bookingSlotsShema,
    status: {
      type: String,
      enum: partnerStatusTypes,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

salonSchema.plugin(paginate);
salonSchema.index({location: '2dsphere'});

module.exports.Salon = mongoose.model('Salon', salonSchema);
