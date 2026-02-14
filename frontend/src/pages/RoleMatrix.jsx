import { useState, useEffect } from 'react';
import api from '../services/api';

const RoleMatrix = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [rolesRes, permsRes] = await Promise.all([
                api.get('/roles'),
                api.get('/roles/permissions'),
            ]);
            setRoles(rolesRes.data);
            setPermissions(permsRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const togglePermission = async (roleId, permissionId, hasPermission) => {
        try {
            if (hasPermission) {
                await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
            } else {
                await api.post(`/roles/${roleId}/permissions/${permissionId}`);
            }
            // Optimistic update or refetch
            fetchData();
        } catch (error) {
            console.error('Error toggling permission', error);
            alert('Failed to update permission');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Permission Matrix</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="px-6 py-3 text-left font-medium text-gray-600">Permission / Role</th>
                            {roles.map(role => (
                                <th key={role._id} className="px-6 py-3 text-center font-medium text-gray-600">
                                    {role.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map(perm => (
                            <tr key={perm._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {perm.name}
                                    <div className="text-xs text-gray-500 font-normal">{perm.description}</div>
                                </td>
                                {roles.map(role => {
                                    const hasPermission = role.permissions.some(p => p._id === perm._id);
                                    return (
                                        <td key={`${role._id}-${perm._id}`} className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={hasPermission}
                                                onChange={() => togglePermission(role._id, perm._id, hasPermission)}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                disabled={role.name === 'Admin' && perm.name === 'manage_permissions'} // Prevent locking out admin
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleMatrix;
