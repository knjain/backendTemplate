const {default: mongoose} = require('mongoose');
const {paginate} = require('../plugins/paginate');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    report: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          reason: {
            type: String,
            required: true,
          },
          at: {
            type: Date,
            required: true,
          },
        },
      ],
      default: [],
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
  },
  {timestamps: true}
);

reviewSchema.plugin(paginate);

module.exports.Review = mongoose.model('SalonReview', reviewSchema);
