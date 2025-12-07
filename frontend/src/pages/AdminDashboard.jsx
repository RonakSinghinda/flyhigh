import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import ExpenseCard from '../components/ExpenseCard';

/**
 * Manager Dashboard Component
 * Allows admins to view all expenses, approve/reject them, and manage budgets
 */
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('expenses');
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Budget form state
    const [budgetForm, setBudgetForm] = useState({
        category: 'Travel',
        totalAmount: '',
        period: '',
    });
    const [editingBudgetId, setEditingBudgetId] = useState(null);

    const categories = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Hardware', 'Training', 'Other'];

    useEffect(() => {
        fetchExpenses();
        fetchBudgets();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data.expenses);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch expenses');
            setLoading(false);
        }
    };

    const fetchBudgets = async () => {
        try {
            const response = await api.get('/budgets');
            setBudgets(response.data.budgets);
        } catch (error) {
            console.error('Failed to fetch budgets:', error);
        }
    };

    const handleApprove = async (id) => {
        const notes = window.prompt('Add approval notes (optional):');

        try {
            await api.put(`/expenses/${id}/status`, {
                status: 'approved',
                reviewNotes: notes || '',
            });
            setSuccess('Expense approved successfully');
            fetchExpenses();
            fetchBudgets(); // Refresh budgets as spent amount updated
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to approve expense');
        }
    };

    const handleReject = async (id) => {
        const notes = window.prompt('Please provide a reason for rejection:');

        if (!notes) {
            setError('Rejection reason is required');
            return;
        }

        try {
            await api.put(`/expenses/${id}/status`, {
                status: 'rejected',
                reviewNotes: notes,
            });
            setSuccess('Expense rejected successfully');
            fetchExpenses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reject expense');
        }
    };

    // Budget management
    const handleBudgetChange = (e) => {
        setBudgetForm({
            ...budgetForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingBudgetId) {
                await api.put(`/budgets/${editingBudgetId}`, budgetForm);
                setSuccess('Budget updated successfully');
                setEditingBudgetId(null);
            } else {
                await api.post('/budgets', budgetForm);
                setSuccess('Budget created successfully');
            }

            setBudgetForm({
                category: 'Travel',
                totalAmount: '',
                period: '',
            });

            fetchBudgets();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save budget');
        }
    };

    const handleEditBudget = (budget) => {
        setEditingBudgetId(budget._id);
        setBudgetForm({
            category: budget.category,
            totalAmount: budget.totalAmount,
            period: budget.period,
        });
    };

    const handleDeleteBudget = async (id) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) {
            return;
        }

        try {
            await api.delete(`/budgets/${id}`);
            setSuccess('Budget deleted successfully');
            fetchBudgets();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete budget');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    // Filter expenses
    const filteredExpenses = filter === 'all'
        ? expenses
        : expenses.filter(e => e.status === filter);

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Manager Dashboard</h2>
                    <p>Manage expenses and budgets</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Tab Navigation */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('expenses')}
                    >
                        Expenses
                    </button>
                    <button
                        className={`tab ${activeTab === 'budgets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('budgets')}
                    >
                        Budgets
                    </button>
                </div>

                {/* Expenses Tab */}
                {activeTab === 'expenses' && (
                    <div className="tab-content">
                        <div className="filter-section">
                            <label>Filter by Status:</label>
                            <div className="filter-buttons">
                                <button
                                    className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFilter('pending')}
                                >
                                    Pending ({expenses.filter(e => e.status === 'pending').length})
                                </button>
                                <button
                                    className={`btn btn-sm ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFilter('approved')}
                                >
                                    Approved ({expenses.filter(e => e.status === 'approved').length})
                                </button>
                                <button
                                    className={`btn btn-sm ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFilter('rejected')}
                                >
                                    Rejected ({expenses.filter(e => e.status === 'rejected').length})
                                </button>
                                <button
                                    className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All ({expenses.length})
                                </button>
                            </div>
                        </div>

                        <div className="expenses-grid">
                            {filteredExpenses.length === 0 ? (
                                <p className="empty-state">No {filter !== 'all' ? filter : ''} expenses found</p>
                            ) : (
                                filteredExpenses.map(expense => (
                                    <ExpenseCard
                                        key={expense._id}
                                        expense={expense}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        isAdmin={true}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Budgets Tab */}
                {activeTab === 'budgets' && (
                    <div className="tab-content">
                        {/* Budget Form */}
                        <div className="card">
                            <h3>{editingBudgetId ? 'Edit Budget' : 'Create New Budget'}</h3>
                            <form onSubmit={handleBudgetSubmit} className="budget-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="category">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={budgetForm.category}
                                            onChange={handleBudgetChange}
                                            required
                                            disabled={editingBudgetId !== null}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="totalAmount">Total Budget (₹)</label>
                                        <input
                                            type="number"
                                            id="totalAmount"
                                            name="totalAmount"
                                            value={budgetForm.totalAmount}
                                            onChange={handleBudgetChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter budget amount"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="period">Period</label>
                                        <input
                                            type="text"
                                            id="period"
                                            name="period"
                                            value={budgetForm.period}
                                            onChange={handleBudgetChange}
                                            required
                                            placeholder="e.g., Q1 2024, Jan 2024"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingBudgetId ? 'Update Budget' : 'Create Budget'}
                                    </button>
                                    {editingBudgetId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingBudgetId(null);
                                                setBudgetForm({ category: 'Travel', totalAmount: '', period: '' });
                                            }}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Budgets List */}
                        <div className="budgets-section">
                            <h3>All Budgets ({budgets.length})</h3>
                            {budgets.length === 0 ? (
                                <p className="empty-state">No budgets created yet</p>
                            ) : (
                                <div className="budgets-grid">
                                    {budgets.map(budget => {
                                        const percentage = (budget.spentAmount / budget.totalAmount) * 100;
                                        const remaining = budget.totalAmount - budget.spentAmount;

                                        return (
                                            <div key={budget._id} className="budget-card">
                                                <div className="budget-header">
                                                    <h4>{budget.category}</h4>
                                                    <span className="budget-period">{budget.period}</span>
                                                </div>

                                                <div className="budget-amounts">
                                                    <div className="budget-stat">
                                                        <span className="label">Total Budget</span>
                                                        <span className="value">{formatCurrency(budget.totalAmount)}</span>
                                                    </div>
                                                    <div className="budget-stat">
                                                        <span className="label">Spent</span>
                                                        <span className="value spent">{formatCurrency(budget.spentAmount)}</span>
                                                    </div>
                                                    <div className="budget-stat">
                                                        <span className="label">Remaining</span>
                                                        <span className="value remaining">{formatCurrency(remaining)}</span>
                                                    </div>
                                                </div>

                                                <div className="budget-progress">
                                                    <div className="progress-bar">
                                                        <div
                                                            className={`progress-fill ${percentage > 90 ? 'danger' : percentage > 70 ? 'warning' : 'success'}`}
                                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="progress-label">{percentage.toFixed(1)}% used</span>
                                                </div>

                                                <div className="budget-actions">
                                                    <button onClick={() => handleEditBudget(budget)} className="btn btn-sm btn-secondary">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteBudget(budget._id)} className="btn btn-sm btn-danger">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminDashboard;
