const {restaurantSlotCategoryTypes, dayNames} = require('../../../constants');

const scheduleSchema = {
  openTime: {
    type: String,
    match: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
    default: null,
  },
  closeTime: {
    type: String,
    match: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
    default: null,
  },
  closed: {
    type: Boolean,
    default: true,
  },
};

const regularHrsSchema = {
  type: dayNames.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: scheduleSchema,
    }),
    {}
  ),
  default: dayNames.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: {openTime: null, closeTime: null, closed: true},
    }),
    {}
  ),
};

const specialHrsSchema = {
  type: [
    {
      date: {
        type: Date,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      schedule: {
        type: scheduleSchema,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  default: [],
};

const bookingSlotsShema = {
  type: dayNames.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: restaurantSlotCategoryTypes.reduce(
        (acc1, curr1) => ({
          ...acc1,
          [curr1]: {
            type: {
              ...scheduleSchema,
              gap: {type: Number, default: null},
            },
          },
        }),
        {}
      ),
    }),
    {}
  ),
  default: dayNames.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: restaurantSlotCategoryTypes.reduce(
        (acc1, curr1) => ({
          ...acc1,
          [curr1]: {openTime: null, closeTime: null, closed: true, gap: null},
        }),
        {}
      ),
    }),
    {}
  ),
};

module.exports = {
  bookingSlotsShema,
  regularHrsSchema,
  specialHrsSchema,
};
