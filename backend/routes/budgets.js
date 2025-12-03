const express = require('express');
const {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
} = require('../controllers/budgetController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Budget routes
router.route('/')
    .post(authorize('admin'), createBudget)  // Admin creates budget
    .get(getBudgets);                        // All users can view budgets

router.route('/:id')
    .get(getBudgetById)                      // Get single budget
    .put(authorize('admin'), updateBudget)   // Admin updates budget
    .delete(authorize('admin'), deleteBudget); // Admin deletes budget

module.exports = router;
