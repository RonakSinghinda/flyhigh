const mongoose = require('mongoose');

/**
 * Expense Schema
 * Tracks employee expenses with approval workflow
 */
const expenseSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Expense must belong to a user'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: {
                values: ['Travel', 'Meals', 'Office Supplies', 'Software', 'Hardware', 'Training', 'Other'],
                message: '{VALUE} is not a valid category',
            },
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            trim: true,
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        date: {
            type: Date,
            required: [true, 'Please add expense date'],
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        receiptUrl: {
            type: String,
            default: null,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
        reviewNotes: {
            type: String,
            trim: true,
            maxlength: [500, 'Review notes cannot be more than 500 characters'],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Index for efficient queries
expenseSchema.index({ employee: 1, status: 1 });
expenseSchema.index({ status: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
