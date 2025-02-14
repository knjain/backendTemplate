const {fileUploadService} = require('../../microservices');
const {Dish, DishSubCategory} = require('../../models/restaurant');

async function getDishes(filters, options) {
  return Dish.paginate(filters, options);
}
async function findDishById(id) {
  return Dish.findById(id)
    .populate(['category', 'subCategory'])
    .populate('restaurant', '_id name');
}
async function updateDishById(id, updates, dishImage) {
  if (dishImage) {
    const {image} = await Dish.findById(id);
    fileUploadService.s3Delete(image.key).catch(err => {
      console.log('Failed to delete image: ' + image.key + err);
    });
    const [newImage] = fileUploadService.s3Upload([dishImage], 'restaurantDishes');
    return Dish.findByIdAndUpdate(id, {...updates, image: newImage}, {new: true});
  }
  return Dish.findByIdAndUpdate(id, updates, {new: true});
}
async function createDish(dishDetails, dishImage) {
  const [image] = await fileUploadService.s3Upload([dishImage], 'restaurantDishes');
  return Dish.create({...dishDetails, image});
}
async function deleteDishById(id) {
  return Dish.findByIdAndDelete(id).then(async doc => {
    fileUploadService.s3Delete(doc.image.key).catch(err => {
      console.log('Failed to delete dish image from s3', err);
    });
    return doc;
  });
}

async function findSubCategoryByName(name) {
  return DishSubCategory.findOne({name: {$regex: name, $options: 'i'}});
}

async function getSubCategories() {
  return DishSubCategory.find({});
}

async function addSubCategory(name) {
  const subCategory = await findSubCategoryByName(name);
  if (subCategory) {
    throw new ApiError(httpStatus.CONFLICT, 'Sub Category already exists');
  }
  return DishSubCategory.create({name});
}

module.exports = {
  getDishes,
  findDishById,
  updateDishById,
  createDish,
  deleteDishById,
  addSubCategory,
  getSubCategories,
};
