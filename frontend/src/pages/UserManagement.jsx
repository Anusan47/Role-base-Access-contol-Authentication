import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (query = '') => {
        try {
            const res = await api.get(`/users?search=${query}`);
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        fetchUsers(e.target.value);
    };

    const toggleStatus = async (userId, currentStatus) => {
        try {
            await api.patch(`/users/${userId}/status`, { isActive: !currentStatus });
            fetchUsers(search);
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${userId}`);
            fetchUsers(search);
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    if (loading) return <div>Loading Users...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="px-6 py-4">{u.name}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4">
                                    {u.roles.map(r => (
                                        <span key={r._id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                                            {r.name}
                                        </span>
                                    ))}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {u.isActive ? 'Active' : 'Banned'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={() => toggleStatus(u._id, u.isActive)}
                                        className={`${u.isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded text-sm`}
                                        disabled={u._id === currentUser.sub} // Prevent self-ban
                                    >
                                        {u.isActive ? 'Ban' : 'Unban'}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(u._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        disabled={u._id === currentUser.sub} // Prevent self-delete
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
