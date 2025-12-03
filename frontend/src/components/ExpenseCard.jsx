/**
 * Expense Card Component
 * Displays expense information with action buttons
 */
const ExpenseCard = ({ expense, onEdit, onDelete, onApprove, onReject, isAdmin }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="expense-card">
            <div className="expense-header">
                <div className="expense-meta">
                    <h3 className="expense-amount">{formatCurrency(expense.amount)}</h3>
                    <span className={`status-badge ${expense.status}`}>
                        {expense.status}
                    </span>
                </div>
                <span className="expense-date">{formatDate(expense.date)}</span>
            </div>

            <div className="expense-body">
                <div className="expense-detail">
                    <span className="label">Category:</span>
                    <span className="value">{expense.category}</span>
                </div>

                <div className="expense-detail">
                    <span className="label">Description:</span>
                    <span className="value">{expense.description}</span>
                </div>

                {isAdmin && expense.employee && (
                    <div className="expense-detail">
                        <span className="label">Employee:</span>
                        <span className="value">{expense.employee.name}</span>
                    </div>
                )}

                {expense.reviewNotes && (
                    <div className="expense-detail">
                        <span className="label">Review Notes:</span>
                        <span className="value review-notes">{expense.reviewNotes}</span>
                    </div>
                )}
            </div>

            <div className="expense-actions">
                {/* Employee actions - only for pending expenses */}
                {!isAdmin && expense.status === 'pending' && (
                    <>
                        <button onClick={() => onEdit(expense)} className="btn btn-sm btn-secondary">
                            Edit
                        </button>
                        <button onClick={() => onDelete(expense._id)} className="btn btn-sm btn-danger">
                            Delete
                        </button>
                    </>
                )}

                {/* Admin actions - only for pending expenses */}
                {isAdmin && expense.status === 'pending' && (
                    <>
                        <button onClick={() => onApprove(expense._id)} className="btn btn-sm btn-success">
                            Approve
                        </button>
                        <button onClick={() => onReject(expense._id)} className="btn btn-sm btn-danger">
                            Reject
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExpenseCard;
