const mongoose = require('mongoose');

const {platformSettingNames} = require('../constants');

const platformSettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lower: true,
      required: [true, 'A platform setting must have a name'],
      enum: {
        values: Object.values(platformSettingNames),
        message: 'Unsupported platform setting',
      },
    },
    value: {
      type: Number,
      required: [true, 'A platform setting must have a value'],
    },
    unit: {
      type: String,
      required: [true, 'A platform setting must have a unit'],
      enum: {
        values: ['%', '$'],
        message: 'Unit must be either % or $',
      },
    },
  },
  {timestamps: true}
);

const PlatformSetting = mongoose.model('PlatformSetting', platformSettingSchema);

// Unique index on name field to ensure no settings are duplicated
platformSettingSchema.index({name: 1}, {unique: true});

module.exports = {PlatformSetting};
