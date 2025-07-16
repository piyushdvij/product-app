/**
 * Product Model
 * -----------------
 * Defines the Mongoose schema for a Product.
 * - Each product has: name, price, description, and category reference.
 * - Uses timestamps for createdAt and updatedAt.
 */

const mongoose = require('mongoose');

// Define Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name must be provided
      trim: true,     // removes leading/trailing spaces automatically
     
    },
    price: {
      type: Number,
      required: true, // price must be provided
    },
    description: {
      type: String,
      default: '', // optional
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true, // must belong to a valid Category
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt fields
  }
);

// Export Product model
module.exports = mongoose.model('Product', productSchema);
