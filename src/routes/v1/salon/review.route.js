const express = require('express');
const router = express.Router({mergeParams: true});
const validate = require('../../../middlewares/validate');

const {reviewValidation} = require('../../../validations/salon');
const {reviewController} = require('../../../controllers/salon');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

router.get('/:reviewId', validate(reviewValidation.getReview), firebaseAuth('All'), reviewController.getReview);
router.get('/', validate(reviewValidation.getReviews), firebaseAuth('All'), reviewController.getReviews);

router.post('/', validate(reviewValidation.createReview), firebaseAuth('All'), reviewController.createReview);

router.post(
  '/:reviewId/report',
  validate(reviewValidation.reportReview),
  firebaseAuth('All'),
  reviewController.reportReview
);

module.exports = router;
