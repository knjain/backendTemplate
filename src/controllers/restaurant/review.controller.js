const catchAsync = require('../../utils/catchAsync');
const {reviewService} = require('../../services/restaurant');
const {getPaginateConfig} = require('../../utils/queryPHandler');

const getReview = catchAsync(async (req, res) => {
  const data = await reviewService.findReviewById(req.params.reviewId);
  res.status(200).send({data});
});

const getReviews = catchAsync(async (req, res) => {
  const {filters, options} = getPaginateConfig(req.query);
  options.populate = ['user::_id,name,profilePic'];
  if (filters.name) {
    filters.postPopulateFilters = {
      'user.name': filters.name,
    };
    delete filters.name;
  }
  const data = await reviewService.getReviews(filters, options);
  res.status(200).send({data});
});

const createReview = catchAsync(async (req, res) => {
  const data = await reviewService.createReview({
    ...req.body,
    user: req.user._id,
    restaurant: req.params.restaurantId,
  });
  res.status(201).send({data});
});

const updateReview = catchAsync(async (req, res) => {
  const data = await reviewService.updateReviewById(req.params.reviewId, req.body);
  res.status(200).send({data});
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req.params.reviewId);
  res.status(204).send();
});

const reportReview = catchAsync(async (req, res) => {
  const data = await reviewService.reportReviewById(req.params.reviewId, req.body.reason, req.user._id);
  res.status(200).send({data});
});

module.exports = {
  getReview,
  getReviews,
  reportReview,
  createReview,
  updateReview,
  deleteReview,
};
