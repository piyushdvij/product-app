const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

// Create category
router.post('/create', categoryController.createCategory);

// Get all categories
router.get('/fetch', categoryController.getCategories);

// ✅ Protect this route with auth middleware
router.get('/protected', auth, (req, res) => {
  res.json({ message: '✅ You have access to this protected API!' });
});


module.exports = router;
