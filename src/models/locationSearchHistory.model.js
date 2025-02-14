const mongoose = require('mongoose');

const locationSearchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    searches: {
      type: [
        {
          address: String,
          city: String,
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
        },
      ],
      default: [],
    },
  },
  {timestamps: true}
);

const LocationSearchHistory = mongoose.model('LocationSearchHistory', locationSearchHistorySchema);

module.exports = {LocationSearchHistory};
