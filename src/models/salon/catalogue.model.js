const {default: mongoose} = require('mongoose');
const {paginate} = require('../plugins/paginate');
const {serviceDurationValues} = require('../../constants');

const catalogueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: {
      key: String,
      url: String,
    },
    required: true,
  },
  duration: {
    type: String,
    enum: serviceDurationValues,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  specialists: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SalonExpert',
    required: true,
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalonCategory',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

catalogueSchema.plugin(paginate);

module.exports.Catalogue = mongoose.model('SalonCatalogue', catalogueSchema);
