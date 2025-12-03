const express = require('express');
const {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    updateExpenseStatus,
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Expense CRUD routes
router.route('/')
    .post(createExpense)          // Employee creates expense
    .get(getExpenses);            // Employee sees own, Admin sees all

router.route('/:id')
    .get(getExpenseById)          // Get single expense
    .put(updateExpense)           // Employee updates own pending expense
    .delete(deleteExpense);       // Employee deletes own pending expense

// Admin only - Update expense status (approve/reject)
router.put('/:id/status', authorize('admin'), updateExpenseStatus);

module.exports = router;
