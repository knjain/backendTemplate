const mongoose = require('mongoose');
const {paginate} = require('../plugins/paginate');
const {regularHrsSchema, specialHrsSchema, bookingSlotsShema} = require('../schemas/restaurant');
const {partnerStatusTypes} = require('../../constants');

const restaurantSchema = new mongoose.Schema(
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
      ref: 'RestaurantCategory',
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
    facilities: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'RestaurantFacility',
      default: [],
    },
    availableForBooking: {
      type: Boolean,
      default: false,
    },
    vendor: {
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

restaurantSchema.plugin(paginate);
restaurantSchema.index({location: '2dsphere'});

module.exports.Restaurant = mongoose.model('Restaurant', restaurantSchema);
