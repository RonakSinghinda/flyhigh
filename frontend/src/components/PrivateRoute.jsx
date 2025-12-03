import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Checks for required role if specified
 */
const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        return <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} replace />;
    }

    return children;
};

export default PrivateRoute;
