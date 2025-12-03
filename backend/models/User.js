const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Supports two roles: 'employee' and 'admin'
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Don't return password by default in queries
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

/**
 * Hash password before saving to database
 * Only hash if password is modified
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
