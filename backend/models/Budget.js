const mongoose = require('mongoose');

/**
 * Budget Schema
 * Tracks budget allocation and spending by category
 */
const budgetSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: [true, 'Please add a category'],
            unique: true,
            enum: {
                values: ['Travel', 'Meals', 'Office Supplies', 'Software', 'Hardware', 'Training', 'Other'],
                message: '{VALUE} is not a valid category',
            },
        },
        totalAmount: {
            type: Number,
            required: [true, 'Please add total budget amount'],
            min: [0, 'Budget amount must be positive'],
        },
        spentAmount: {
            type: Number,
            default: 0,
            min: [0, 'Spent amount cannot be negative'],
        },
        period: {
            type: String,
            required: [true, 'Please add budget period'],
            trim: true,
            // e.g., "Q1 2024", "January 2024", "FY 2024"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual field for remaining budget
budgetSchema.virtual('remainingAmount').get(function () {
    return this.totalAmount - this.spentAmount;
});

// Ensure virtuals are included when converting to JSON
budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Budget', budgetSchema);
