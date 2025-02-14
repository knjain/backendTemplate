const express = require('express');
const router = express.Router();

const {categoryValidation} = require('../../../validations/salon');
const {categoryController} = require('../../../controllers/salon');
const {fileUploadService} = require('../../../microservices');
const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

router.post(
  '/',
  fileUploadService.multerUpload.single('icon'),
  firebaseAuth('Admin'),
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);

router.get(
  '/',
  //   firebaseAuth('All'),
  categoryController.getCategories
);

router.patch(
  '/:id',
  fileUploadService.multerUpload.single('icon'),
  firebaseAuth('Admin'),
  validate(categoryValidation.updateCategory),
  categoryController.updateCategory
);

module.exports = router;
