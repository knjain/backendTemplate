const {default: mongoose} = require('mongoose');
const {paginate} = require('../plugins/paginate');

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    profilePic: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'SalonCategory',
      required: true,
    },
    exp: {
      type: Number,
      required: true,
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
  },
  {timestamps: true}
);

expertSchema.plugin(paginate);

module.exports.Expert = mongoose.model('SalonExpert', expertSchema);
