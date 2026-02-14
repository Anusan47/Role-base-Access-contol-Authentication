import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // To check if current user is admin

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await api.get('/roles');
            setRoles(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch roles", error);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName) return;
        try {
            await api.post('/roles', { name: newRoleName, description });
            setNewRoleName('');
            setDescription('');
            fetchRoles();
        } catch (error) {
            alert('Failed to create role');
        }
    };

    const handleDeleteRole = async (roleId, roleName) => {
        if (['Admin', 'User', 'Manager'].includes(roleName)) {
            alert("Cannot delete system roles.");
            return;
        }
        if (!window.confirm(`Delete role "${roleName}"?`)) return;

        try {
            await api.delete(`/roles/${roleId}`);
            fetchRoles();
        } catch (error) {
            alert('Failed to delete role');
        }
    };

    if (loading) return <div>Loading Roles...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Roles Management</h1>

            {/* Create Role Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h3 className="text-lg font-bold mb-4">Create New Role</h3>
                <form onSubmit={handleCreateRole} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role Name</label>
                        <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="mt-1 p-2 border rounded shadow-sm focus:ring-blue-500"
                            placeholder="e.g. Editor"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 border rounded shadow-sm w-full focus:ring-blue-500"
                            placeholder="Role description..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Create Role
                    </button>
                </form>
            </div>

            {/* Roles List */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions Count</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {roles.map((r) => (
                            <tr key={r._id}>
                                <td className="px-6 py-4 font-medium">{r.name}</td>
                                <td className="px-6 py-4 text-gray-500">{r.description}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                        {r.permissions ? r.permissions.length : 0} permissions
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {!['Admin', 'User', 'Manager'].includes(r.name) && (
                                        <button
                                            onClick={() => handleDeleteRole(r._id, r.name)}
                                            className="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    {['Admin', 'User', 'Manager'].includes(r.name) && (
                                        <span className="text-gray-400 text-sm italic">System Role</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Roles;
