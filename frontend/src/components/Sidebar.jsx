import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const hasPermission = (permName) => {
        return user?.roles.some(role =>
            role.permissions.some(p => p.name === permName)
        );
    };

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-6">Access Control</h2>
            <nav className="flex flex-col space-y-2">
                <Link to="/dashboard" className="p-2 hover:bg-gray-700 rounded">Dashboard</Link>

                {hasPermission('manage_roles') && (
                    <Link to="/roles" className="p-2 hover:bg-gray-700 rounded">Manage Roles</Link>
                )}

                {hasPermission('manage_permissions') && (
                    <Link to="/matrix" className="p-2 hover:bg-gray-700 rounded">Permission Matrix</Link>
                )}

                <button onClick={logout} className="p-2 hover:bg-red-700 rounded text-left mt-auto">
                    Logout
                </button>
            </nav>
            <div className="mt-8 text-sm text-gray-400">
                User: {user?.name} <br />
                Role: {user?.roles.map(r => r.name).join(', ')}
            </div>
        </div>
    );
};

export default Sidebar;
