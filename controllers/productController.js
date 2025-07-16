/**
 * Product controller with CRUD handlers.
 * Includes normal code & pagination code in comments.
 */

const Product = require('../models/product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // ✅ Normal: get all products

    // ✅ To enable pagination, comment out the line above & use below:
    // const page = parseInt(req.query.page) || 1; // page number
    // const limit = parseInt(req.query.limit) || 10; // items per page
    // const skip = (page - 1) * limit;
    // const total = await Product.countDocuments();
    // const products = await Product.find().skip(skip).limit(limit);
    // res.json({ page, limit, totalPages: Math.ceil(total/limit), totalItems: total, data: products });

    res.json(products); // normal response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated doc
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aggregate: Get products grouped by category
exports.getProductsWithCategory = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $lookup: {
          from: 'categories', // collection name in MongoDB (plural!)
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $group: {
          _id: '$categoryInfo.name',
          products: { $push: '$$ROOT' }
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};