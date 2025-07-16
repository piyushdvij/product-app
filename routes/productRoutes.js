/**
 * Product routes.
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
 
// Create a new product
router.post('/create', productController.createProduct);

// Get all products
router.get('/fetch', productController.getProducts);

// Get single product by ID
router.get('/fetch/:id', productController.getProductById);

// Update product by ID
router.put('/update/:id', productController.updateProduct);

// Delete product by ID
router.delete('/delete/:id', productController.deleteProduct);

// NEW: Aggregate products with category
router.get('/aggregate/all', productController.getProductsWithCategory);

module.exports = router;
