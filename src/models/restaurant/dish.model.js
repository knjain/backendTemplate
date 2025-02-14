const {default: mongoose} = require('mongoose');
const {paginate} = require('../plugins/paginate');

const subCategoryScehma = new mongoose.Schema(
  {
    name: {type: String, required: true},
  },
  {timestamps: true}
);

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: {
        key: String,
        url: String,
      },
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantCategory',
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DishSubCategory',
      required: true,
    },
    isNonVeg: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
  },
  {timestamps: true, selectPopulatedPaths: true}
);

dishSchema.plugin(paginate);
subCategoryScehma.plugin(paginate);

const Dish = mongoose.model('Dish', dishSchema);
const DishSubCategory = mongoose.model('DishSubCategory', subCategoryScehma);

module.exports = {
  Dish,
  DishSubCategory,
};
