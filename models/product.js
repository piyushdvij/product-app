/**
 * Mongoose schema for Product.
*/

const mongoose = require('mongoose');

// Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // name is required
  },
  price: {
    type: Number,
    required: true // price is required
  },
  description: {
    type: String,
    default: '' // optional
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Export Product model
module.exports = mongoose.model('Product', productSchema);