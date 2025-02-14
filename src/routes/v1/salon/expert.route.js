const express = require('express');
const router = express.Router();

const {expertValidation} = require('../../../validations/salon');
const {expertController} = require('../../../controllers/salon');
const {fileUploadService} = require('../../../microservices');
const validate = require('../../../middlewares/validate');
const firebaseAuth = require('../../../middlewares/firebaseAuth');

router.get('/', firebaseAuth('All'), validate(expertValidation.getExperts), expertController.getExperts);
router.get('/:expertId', firebaseAuth('All'), validate(expertValidation.getExpert), expertController.getExpert);

router.patch(
  '/:expertId',
  fileUploadService.multerUpload.single('profilePic'),
  firebaseAuth('SalonOwner'),
  validate(expertValidation.updateExpert),
  expertController.updateExpert
);

router.post(
  '/',
  fileUploadService.multerUpload.single('profilePic'),
  firebaseAuth('SalonOwner'),
  validate(expertValidation.createExpert),
  expertController.createExpert
);

router.delete(
  '/:expertId',
  firebaseAuth('SalonOwner'),
  validate(expertValidation.deleteExpert),
  expertController.deleteExpert
);

module.exports = router;
