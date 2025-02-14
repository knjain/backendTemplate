const express = require('express');
const router = express.Router({mergeParams: true});

const {catalogueValidation} = require('../../../validations/salon');
const {catalogueController} = require('../../../controllers/salon');
const {fileUploadService} = require('../../../microservices');
const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

router.get('/', firebaseAuth('All'), validate(catalogueValidation.getServices), catalogueController.getServices);
router.get(
  '/:serviceId',
  firebaseAuth('All'),
  validate(catalogueValidation.getService),
  catalogueController.getService
);

router.post(
  '/',
  fileUploadService.multerUpload.single('image'),
  firebaseAuth('All'),
  validate(catalogueValidation.createService),
  catalogueController.createService
);

router.patch(
  '/:serviceId',
  fileUploadService.multerUpload.single('image'),
  firebaseAuth('All'),
  validate(catalogueValidation.updateService),
  catalogueController.updateService
);

router.get(
  '/:serviceId',
  firebaseAuth('All'),
  validate(catalogueValidation.deleteService),
  catalogueController.deleteService
);

module.exports = router;
