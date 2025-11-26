// models/Budget.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
}, { timestamps: true });

const budgetSchema = new mongoose.Schema({
    user: String,
    name: String,
    totalAmount: Number,
    expenses: [expenseSchema],
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema); 
