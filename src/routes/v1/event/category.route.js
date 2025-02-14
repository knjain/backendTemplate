const express = require('express');
const router = express.Router();

const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

const {eventCategoryValidation} = require('../../../validations/event');
const {eventCategoryController} = require('../../../controllers/event');
const {fileUploadService} = require('../../../microservices');

router.post(
  '/',
  fileUploadService.multerUpload.single('icon'),
  firebaseAuth('Admin'),
  validate(eventCategoryValidation.createCategory),
  eventCategoryController.createCategory
);

router.get('/', eventCategoryController.getCategories);

router.get(
  '/:eventCategoryId',
  firebaseAuth('All'),
  validate(eventCategoryValidation.getOneCategory),
  eventCategoryController.getOneCategory
);

router.patch(
  '/:eventCategoryId',
  fileUploadService.multerUpload.single('icon'),
  firebaseAuth('Admin'),
  validate(eventCategoryValidation.updateCategory),
  eventCategoryController.updateCategory
);

router.delete(
  '/:eventCategoryId',
  firebaseAuth('Admin'),
  validate(eventCategoryValidation.deleteCategory),
  eventCategoryController.deleteCategory
);

module.exports = router;
