const catchAsync = require('../../utils/catchAsync');
const {categoryService} = require('../../services/restaurant');

const createCategory = catchAsync(async (req, res) => {
  const data = await categoryService.createCategory(req.body.name, req.file);
});

const getCategories = catchAsync(async (req, res) => {
  const data = await categoryService.getCategories();
  res.status(200).send({data});
});

const updateCategory = catchAsync(async (req, res) => {
  const data = await categoryService.updateCategoryById(req.params.id, req.body.name, req.file);
  res.status(201).send({data});
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
};
