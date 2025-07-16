/**
 * Main server entry point.
 * Loads env, connects DB, sets up middlewares & routes.
 */ 
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');  

const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); 
const responseFormat = require('./middleware/responseFormat');
const app = express();

// Connect to MongoDB
connectDB();

// ✅ Basic middlewares
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  //origin: 'https://your-frontend.com'  //allow specific origin
}));
app.use(morgan('dev')); // Log requests
app.use(express.json()); // Parse JSON request bodies
app.use(responseFormat);

// ✅ Custom middleware: Logs method, URL, and time
app.use((req, res, next) => {
  console.log(`[CUSTOM LOGGER] ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});


// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});