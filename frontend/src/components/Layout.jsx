import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

/**
 * Layout Component with Navigation
 */
const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="nav-content">
                    <h1 className="app-title">💰 SpendWise</h1>

                    {user && (
                        <div className="nav-actions">
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className={`role-badge ${user.role}`}>{user.role}</span>
                            </div>

                            <div className="nav-links">
                                {user.role === 'admin' ? (
                                    <Link
                                        to="/admin"
                                        className={location.pathname === '/admin' ? 'active' : ''}
                                    >
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        to="/employee"
                                        className={location.pathname === '/employee' ? 'active' : ''}
                                    >
                                        My Expenses
                                    </Link>
                                )}
                            </div>

                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <p>SpendWise © 2024 - Expense Management System</p>
            </footer>
        </div>
    );
};

export default Layout;
