const mongoose = require('mongoose');
const {paginate} = require('../plugins/paginate');

const contactSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);

contactSchema.plugin(paginate);

module.exports.Contact = mongoose.model('RestaurantContact', contactSchema);
