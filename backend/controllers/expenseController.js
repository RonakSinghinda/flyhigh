const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

/**
 * @desc    Create new expense
 * @route   POST /api/expenses
 * @access  Private (Employee)
 */
exports.createExpense = async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;

        const expense = await Expense.create({
            employee: req.user.id,
            amount,
            category,
            description,
            date: date || Date.now(),
        });

        // Populate employee details
        await expense.populate('employee', 'name email');

        res.status(201).json({
            success: true,
            expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get all expenses
 * @route   GET /api/expenses
 * @access  Private (Employee sees own, Admin sees all)
 */
exports.getExpenses = async (req, res) => {
    try {
        let query;

        // If employee, only show their expenses
        // If admin, show all expenses
        if (req.user.role === 'employee') {
            query = Expense.find({ employee: req.user.id });
        } else {
            query = Expense.find();
        }

        // Optional status filter
        if (req.query.status) {
            query = query.where('status').equals(req.query.status);
        }

        const expenses = await query
            .populate('employee', 'name email')
            .populate('reviewedBy', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: expenses.length,
            expenses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get single expense
 * @route   GET /api/expenses/:id
 * @access  Private
 */
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id)
            .populate('employee', 'name email')
            .populate('reviewedBy', 'name email');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        // Check authorization (employee can only see own, admin can see all)
        if (
            req.user.role === 'employee' &&
            expense.employee._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this expense',
            });
        }

        res.status(200).json({
            success: true,
            expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Update expense
 * @route   PUT /api/expenses/:id
 * @access  Private (Employee can only update own pending expenses)
 */
exports.updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        // Check if employee owns this expense
        if (expense.employee.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this expense',
            });
        }

        // Can only update pending expenses
        if (expense.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot update expense with status: ${expense.status}`,
            });
        }

        // Update expense
        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('employee', 'name email');

        res.status(200).json({
            success: true,
            expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Delete expense
 * @route   DELETE /api/expenses/:id
 * @access  Private (Employee can only delete own pending expenses)
 */
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        // Check if employee owns this expense
        if (expense.employee.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this expense',
            });
        }

        // Can only delete pending expenses
        if (expense.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot delete expense with status: ${expense.status}`,
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Update expense status (Approve/Reject)
 * @route   PUT /api/expenses/:id/status
 * @access  Private (Admin only)
 */
exports.updateExpenseStatus = async (req, res) => {
    try {
        const { status, reviewNotes } = req.body;

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid status (approved or rejected)',
            });
        }

        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        // Update expense status
        expense.status = status;
        expense.reviewedBy = req.user.id;
        expense.reviewedAt = Date.now();
        expense.reviewNotes = reviewNotes || '';

        await expense.save();

        // If approved, update budget spent amount
        if (status === 'approved') {
            const budget = await Budget.findOne({ category: expense.category });
            if (budget) {
                budget.spentAmount += expense.amount;
                await budget.save();
            }
        }

        // Populate references
        await expense.populate('employee', 'name email');
        await expense.populate('reviewedBy', 'name email');

        res.status(200).json({
            success: true,
            expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
