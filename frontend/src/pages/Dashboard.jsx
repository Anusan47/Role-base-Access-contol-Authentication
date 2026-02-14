import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-2">Welcome, {user.name}!</h2>
                <p className="text-gray-600">You are logged in as: <span className="font-semibold">{user.roles.map(r => r.name).join(', ')}</span></p>
                <p className="mt-4">Use the sidebar to navigate the system.</p>
            </div>
        </div>
    );
};

export default Dashboard;
