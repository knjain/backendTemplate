const express = require('express');

const firebaseAuth = require('../../middlewares/firebaseAuth');
const validate = require('../../middlewares/validate');
const {platformSettingController} = require('../../controllers');
const {platformSettingValidation} = require('../../validations');

const router = express.Router();

router.post('/seed', firebaseAuth('Admin'), platformSettingController.seedPlatformSettings);

router.get('/', firebaseAuth('Admin'), platformSettingController.getPlatformSettings);

router.patch(
  '/:platformSettingName',
  firebaseAuth('Admin'),
  validate(platformSettingValidation.updatePlatformSetting),
  platformSettingController.updatePlatformSetting
);

module.exports = router;
