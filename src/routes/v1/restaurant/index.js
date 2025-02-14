const express = require('express');
const router = express.Router();

const dishRoute = require('./dish.route');
const reviewRoute = require('./review.route');
const bookingRoute = require('./booking.route');
const facilityRoute = require('./facility.route');
const categoryRoute = require('./category.route');

const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');
const {restaurantController} = require('../../../controllers/restaurant');
const {restaurantValidation} = require('../../../validations/restaurant');
const {fileUploadService} = require('../../../microservices');

router.use('/dishes', dishRoute);
router.use('/bookings', bookingRoute);
router.use('/categories', categoryRoute);
router.use('/facilities', facilityRoute);
router.use('/:restaurantId/reviews', reviewRoute);

router.get(
  '/',
  firebaseAuth('All'),
  validate(restaurantValidation.getRestaurants),
  restaurantController.getRestaurants
);
router.get(
  '/:restaurantId',
  firebaseAuth('All'),
  validate(restaurantValidation.getRestaurantById),
  restaurantController.getRestaurant
);

router.post(
  '/:restaurantId/specialHrs',
  firebaseAuth('RestaurantVendor'),
  validate(restaurantValidation.addSpecialHr),
  restaurantController.addSpecialHr
);

router.patch(
  '/:restaurantId',
  fileUploadService.multerUpload.fields([
    {name: 'thumbnail', maxCount: 1},
    {name: 'images', maxCount: 5},
  ]),
  firebaseAuth('RestaurantVendor'),
  validate(restaurantValidation.updateRestaurant),
  restaurantController.updateRestaurant
);
router.patch(
  '/:restaurantId/securityAmtSettings',
  firebaseAuth('RestaurantVendor'),
  validate(restaurantValidation.updateSecurityAmtSettings),
  restaurantController.updateSecurityAmtSettings
);

router.patch(
  '/:restaurantId/openingHrs',
  firebaseAuth('RestaurantVendor'),
  validate(restaurantValidation.updateOpeningHrs),
  restaurantController.updateOpeningHrs
);

router.patch(
  '/:restaurantId/slots',
  firebaseAuth('RestaurantVendor'),
  validate(restaurantValidation.updateSlot),
  restaurantController.updateSlot
);

router.patch(
  '/:restaurantId/specialHrs/:specialHrId',
  firebaseAuth('RestaurantVendor'),
  validate(restaurantValidation.updateSpecialHr),
  restaurantController.updateSpecialHr
);

router.delete(
  '/:restaurantId/specialHrs/:specialHrId',
  firebaseAuth('RestaurantVendor'),
  validate(restaurantValidation.removeSpecialHr),
  restaurantController.removeSpecialHr
);

module.exports = router;
