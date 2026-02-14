import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    if (requiredPermission) {
        const hasPermission = user.roles.some(role =>
            role.permissions.some(p => p.name === requiredPermission)
        );
        if (!hasPermission) {
            alert('Access Denied: Missing permission ' + requiredPermission);
            return <Navigate to="/" />;
        }
    }

    if (requiredRole) {
        const hasRole = user.roles.some(role => role.name === requiredRole);
        if (!hasRole) {
            // alert('Access Denied: Missing role ' + requiredRole); // Optional: silent redirect preferred?
            console.warn('Access Denied: Missing role ' + requiredRole);
            return <Navigate to="/" />;
        }
    }

    return children;
};

export default ProtectedRoute;
