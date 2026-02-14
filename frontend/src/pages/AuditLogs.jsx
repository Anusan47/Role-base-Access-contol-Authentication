import { useState, useEffect } from 'react';
import api from '../services/api';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/audit');
            setLogs(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        }
    };

    if (loading) return <div>Loading Audit Logs...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Timestamp</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Admin</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Action</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Target ID</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Details</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {log.adminEmail}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                    {log.targetId}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    <div className="max-w-xs truncate" title={log.details}>
                                        {log.details || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {log.ipAddress}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
