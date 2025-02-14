const httpStatus = require('http-status');
const {Review} = require('../../models/salon');
const ApiError = require('../../utils/ApiError');

async function getReviews(filters, options) {
  return Review.paginate(filters, options);
}
async function findReviewById(id) {
  const review = await Review.findById(id).populate('user', '_id name profilePic');
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  return review;
}

async function reportReviewById(id, reason, user) {
  return Review.findOneAndUpdate(id, {
    $push: {
      report: {
        user,
        reason,
        at: new Date(),
      },
    },
  });
}

async function updateReviewById(id, updates) {
  return Review.findOneAndUpdate(id, updates, {new: true});
}
async function createReview(reviewDetails) {
  return Review.create(reviewDetails);
}
async function deleteReviewById(id) {
  return Review.findByIdAndDelete(id);
}

module.exports = {
  getReviews,
  findReviewById,
  updateReviewById,
  createReview,
  deleteReviewById,
  reportReviewById,
};
