const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create category
router.post('/create', categoryController.createCategory);

// Get all categories
router.get('/fetch', categoryController.getCategories);

module.exports = router;
