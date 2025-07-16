const Category = require('../models/category');

/**
 * Create a new Category
 * POST /api/categories
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // ✅ Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.error('Category name is required and must be a non-empty string.', 400);
    }

    // ✅ Check if it already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.error('Category name already exists.', 400);
    }

    const category = new Category({ name: name.trim() });
    const savedCategory = await category.save();

    return res.success(savedCategory, 'Category created successfully.', 201);

  } catch (err) {
    console.error(err);
    return res.error('Internal server error.', 500);
  }
};

/**
 * Get all Categories
 * GET /api/categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.success(categories, 'Categories fetched successfully.');
  } catch (err) {
    console.error(err);
    return res.error('Internal server error.', 500);
  }
};
