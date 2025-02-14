const express = require('express');
const router = express.Router();

const {categoryValidation} = require('../../../validations/restaurant');
const {categoryController} = require('../../../controllers/restaurant');
const {fileUploadService} = require('../../../microservices');
const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

router.post(
  '/',
  fileUploadService.multerUpload.single('icon'),
  // firebaseAuth('All'),
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);

router.patch(
  '/:id',
  fileUploadService.multerUpload.single('icon'),
  firebaseAuth('Admin'),
  validate(categoryValidation.updateCategory),
  categoryController.updateCategory
);

router.get(
  '/',
  // firebaseAuth('All'),
  categoryController.getCategories
);

module.exports = router;
