import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoleMatrix from './pages/RoleMatrix';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UserManagement from './pages/UserManagement';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<Layout />}>
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/matrix"
                            element={
                                <ProtectedRoute requiredPermission="manage_permissions">
                                    <RoleMatrix />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute requiredPermission="view_dashboard">
                                    <AnalyticsDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute requiredPermission="view_users">
                                    <UserManagement />
                                </ProtectedRoute>
                            }
                        />
                        {/* Placeholder for Roles page if needed */}
                        <Route
                            path="/roles"
                            element={
                                <ProtectedRoute requiredPermission="manage_roles">
                                    <div>Roles Management (Use Matrix for permissions)</div>
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
