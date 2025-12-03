import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import ExpenseCard from '../components/ExpenseCard';

/**
 * Employee Dashboard Component
 * Allows employees to create, view, edit, and delete their expenses
 */
const EmployeeDashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Travel',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Hardware', 'Training', 'Other'];

    // Fetch expenses on mount
    useEffect(() => {
        fetchExpenses();
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingId) {
                // Update existing expense
                await api.put(`/expenses/${editingId}`, formData);
                setSuccess('Expense updated successfully');
                setEditingId(null);
            } else {
                // Create new expense
                await api.post('/expenses', formData);
                setSuccess('Expense submitted successfully');
            }

            // Reset form
            setFormData({
                amount: '',
                category: 'Travel',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });

            // Refresh expenses list
            fetchExpenses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit expense');
        }
    };

    const handleEdit = (expense) => {
        setEditingId(expense._id);
        setFormData({
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: new Date(expense.date).toISOString().split('T')[0],
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            amount: '',
            category: 'Travel',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            await api.delete(`/expenses/${id}`);
            setSuccess('Expense deleted successfully');
            fetchExpenses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete expense');
        }
    };

    // Group expenses by status
    const pendingExpenses = expenses.filter(e => e.status === 'pending');
    const approvedExpenses = expenses.filter(e => e.status === 'approved');
    const rejectedExpenses = expenses.filter(e => e.status === 'rejected');

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
                    <h2>My Expenses</h2>
                    <p>Submit and manage your expense claims</p>
                </div>

                {/* Expense Submission Form */}
                <div className="card">
                    <h3>{editingId ? 'Edit Expense' : 'Submit New Expense'}</h3>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="expense-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="amount">Amount (₹)</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                placeholder="Provide details about this expense..."
                                maxLength="500"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Expense' : 'Submit Expense'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Expenses List */}
                <div className="expenses-section">
                    <h3>Pending Expenses ({pendingExpenses.length})</h3>
                    {pendingExpenses.length === 0 ? (
                        <p className="empty-state">No pending expenses</p>
                    ) : (
                        <div className="expenses-grid">
                            {pendingExpenses.map(expense => (
                                <ExpenseCard
                                    key={expense._id}
                                    expense={expense}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    isAdmin={false}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="expenses-section">
                    <h3>Approved Expenses ({approvedExpenses.length})</h3>
                    {approvedExpenses.length === 0 ? (
                        <p className="empty-state">No approved expenses</p>
                    ) : (
                        <div className="expenses-grid">
                            {approvedExpenses.map(expense => (
                                <ExpenseCard
                                    key={expense._id}
                                    expense={expense}
                                    isAdmin={false}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="expenses-section">
                    <h3>Rejected Expenses ({rejectedExpenses.length})</h3>
                    {rejectedExpenses.length === 0 ? (
                        <p className="empty-state">No rejected expenses</p>
                    ) : (
                        <div className="expenses-grid">
                            {rejectedExpenses.map(expense => (
                                <ExpenseCard
                                    key={expense._id}
                                    expense={expense}
                                    isAdmin={false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeDashboard;
