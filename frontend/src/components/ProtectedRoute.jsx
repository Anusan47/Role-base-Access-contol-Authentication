import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermission }) => {
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

    return children;
};

export default ProtectedRoute;
