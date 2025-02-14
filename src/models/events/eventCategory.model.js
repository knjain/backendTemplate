const mongoose = require('mongoose');

const {paginate} = require('../plugins/paginate');

const eventCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
    // type: {
    //   type: String,
    //   enum: categoryTypes,
    //   required: true,
    // },
  },
  {timestamps: true}
);

eventCategorySchema.plugin(paginate);

const EventCategory = mongoose.model('EventCategory', eventCategorySchema);
module.exports = {EventCategory};
