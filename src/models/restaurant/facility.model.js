const {default: mongoose} = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    icon: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
  },
  {timestamps: true}
);

module.exports.Facility = mongoose.model('RestaurantFacility', facilitySchema);
