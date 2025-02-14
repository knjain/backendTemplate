const {default: mongoose} = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    icon: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
  },
  {timestamps: true}
);

module.exports.Category = mongoose.model('RestaurantCategory', categorySchema);
