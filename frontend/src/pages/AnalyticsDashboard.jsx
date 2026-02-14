import { useState, useEffect } from 'react';
import api from '../services/api';

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, loginsToday: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, activityRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/activity')
            ]);
            setStats(statsRes.data);
            setRecentActivity(activityRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        }
    };

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Active Users</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Logins Today</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.loginsToday}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="font-bold text-lg">Recent Login Activity</h3>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recentActivity.map((log) => (
                            <tr key={log._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{log.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{log.ipAddress}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
