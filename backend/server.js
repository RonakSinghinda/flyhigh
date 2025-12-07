require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware - CORS Configuration for Vercel Serverless
// Explicitly set CORS headers before other middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Check if origin is a Vercel deployment with 'flyhigh' in the domain
    const isVercelDomain = origin && origin.includes('vercel.app') && origin.includes('flyhigh');
    const isLocalhost = origin && origin.includes('localhost');

    if (isVercelDomain || isLocalhost || origin === process.env.CLIENT_URL) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SpendWise API is running',
        timestamp: new Date().toISOString(),
    });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;
