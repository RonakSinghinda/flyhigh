const Budget = require('../models/Budget');

/**
 * @desc    Create new budget
 * @route   POST /api/budgets
 * @access  Private (Admin only)
 */
exports.createBudget = async (req, res) => {
    try {
        const { category, totalAmount, period } = req.body;

        // Check if budget already exists for this category
        const existingBudget = await Budget.findOne({ category });
        if (existingBudget) {
            return res.status(400).json({
                success: false,
                message: `Budget already exists for category: ${category}`,
            });
        }

        const budget = await Budget.create({
            category,
            totalAmount,
            period,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            budget,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get all budgets
 * @route   GET /api/budgets
 * @access  Private
 */
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find().populate('createdBy', 'name email').sort('category');

        res.status(200).json({
            success: true,
            count: budgets.length,
            budgets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get single budget
 * @route   GET /api/budgets/:id
 * @access  Private
 */
exports.getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id).populate(
            'createdBy',
            'name email'
        );

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        res.status(200).json({
            success: true,
            budget,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Update budget
 * @route   PUT /api/budgets/:id
 * @access  Private (Admin only)
 */
exports.updateBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            budget,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Delete budget
 * @route   DELETE /api/budgets/:id
 * @access  Private (Admin only)
 */
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found',
            });
        }

        await budget.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Budget deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
