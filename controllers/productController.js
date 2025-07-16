const Product = require("../models/product");

/**
 * Create a new Product
 * POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // ✅ Basic validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.error(
        "Product name is required and must be a non-empty string.",
        400
      );
    }

    if (!price || typeof price !== "number" || price <= 0) {
      return res.error(
        "Product price is required and must be a positive number.",
        400
      );
    }

    if (!category) {
      return res.error("Product category is required.", 400);
    }

    // ✅ Check if it already exists
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
      return res.error('Product name already exists.', 400);
    }

    const product = new Product({
      name: name.trim(),
      price,
      description: description?.trim() || "",
      category,
    });

    const savedProduct = await product.save();

    return res.success(savedProduct, "Product created successfully.", 201);
  } catch (err) {
    console.error(err);
    return res.error("Internal server error.", 500);
  }
};

/**
 * Get Products with optional name filter and pagination.
 * GET /api/products?name=phone&page=1&limit=10
 */

exports.getProducts = async (req, res) => {
  try {
    // ✅ 1️⃣ Pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate how many to skip

    // ✅ 2️⃣ Simple name filter (optional)
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
    }

    // ✅ 3️⃣ Total count for pagination info
    const totalItems = await Product.countDocuments(filter);

    // ✅ 4️⃣ Find products with filter, pagination, and category populated
    const products = await Product.find(filter)
      .populate('category')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: newest first

    // ✅ 5️⃣ Send response with metadata
    return res.success(
      {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        items: products,
      },
      'Products fetched successfully.'
    );

  } catch (err) {
    console.error(err);
    return res.error('Internal server error.', 500);
  }
}; 

/**
 * Get single Product by ID
 * GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.error("Product not found.", 404);
    }

    return res.success(product, "Product fetched successfully.");
  } catch (err) {
    console.error(err);
    return res.error("Internal server error.", 500);
  }
};

/**
 * Update Product by ID
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const updateData = {};
    if (name && typeof name === "string") updateData.name = name.trim();
    if (price && typeof price === "number") updateData.price = price;
    if (description && typeof description === "string")
      updateData.description = description.trim();
    if (category) updateData.category = category;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("category");

    if (!updatedProduct) {
      return res.error("Product not found.", 404);
    }

    return res.success(updatedProduct, "Product updated successfully.");
  } catch (err) {
    console.error(err);
    return res.error("Bad request.", 400);
  }
};

/**
 * Delete Product by ID
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.error("Product not found.", 404);
    }

    return res.success(null, "Product deleted successfully.");
  } catch (err) {
    console.error(err);
    return res.error("Internal server error.", 500);
  }
};

/**
 * Get all products with their category details
 * GET /api/products/with-category
 */

exports.getProductsWithCategory = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $lookup: {
          from: "categories", // MongoDB collection name (always plural!)
          localField: "category", // Product field
          foreignField: "_id", // Category field
          as: "categoryInfo", // Result will be in an array
        },
      },
      {
        $unwind: "$categoryInfo", // Flatten the array to an object
      },
      {
        $project: {
          name: 1,
          price: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          categoryName: "$categoryInfo.name", // Include category name only
        },
      },
    ]);

    return res.success(
      result,
      "Products with category details fetched successfully."
    );
  } catch (err) {
    console.error(err);
    return res.error("Internal server error.", 500);
  }
};
