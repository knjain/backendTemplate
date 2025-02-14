const express = require('express');
const router = express.Router({mergeParams: true});

const {dishController} = require('../../../controllers/restaurant');
const firebaseAuth = require('../../../middlewares/firebaseAuth');
const {dishValidation} = require('../../../validations/restaurant');
const {fileUploadService} = require('../../../microservices');
const validate = require('../../../middlewares/validate');

router.get('/subCategories', firebaseAuth('All'), dishController.getSubCategories);

router.post(
  '/subCategories',
  firebaseAuth('RestaurantVendor,Admin'),
  validate(dishValidation.addSubCategory),
  dishController.addSubCategory
);

router.get('/', firebaseAuth('All'), validate(dishValidation.getDishes), dishController.getDishes);
router.get('/:dishId', firebaseAuth('All'), validate(dishValidation.getDishById), dishController.getDish);

router.post(
  '/',
  fileUploadService.multerUpload.single('image'),
  firebaseAuth('RestaurantVendor,Admin'),
  validate(dishController.createDish),
  dishController.createDish
);

router.patch(
  '/:dishId',
  fileUploadService.multerUpload.single('image'),
  firebaseAuth('RestaurantVendor,Admin'),
  validate(dishValidation.updateDish),
  dishController.updateDish
);

router.delete(
  '/:dishId',
  firebaseAuth('RestaurantVendor,Admin'),
  validate(dishValidation.deleteDish),
  dishController.deleteDish
);

module.exports = router;
