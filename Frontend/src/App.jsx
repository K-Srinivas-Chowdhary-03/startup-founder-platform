import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading components for performance optimization
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const InnovationFeed = React.lazy(() => import('./pages/InnovationFeed'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const PublicProfile = React.lazy(() => import('./pages/PublicProfile'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Messages = React.lazy(() => import('./pages/Messages'));
const Requests = React.lazy(() => import('./pages/Requests'));
const Notifications = React.lazy(() => import('./pages/Notifications'));

const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

const AppContent = () => {
    const location = useLocation();
    const isMessagesPage = location.pathname.startsWith('/messages');

    return (
        <div className={isMessagesPage ? 'd-flex flex-column vh-100' : ''}>
            {!isMessagesPage && <AppNavbar />}
            <main className={isMessagesPage ? 'flex-grow-1 overflow-hidden' : 'py-3'}>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/feed" element={<ProtectedRoute><InnovationFeed /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/profile/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
                        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                        <Route path="/messages/:id" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
};

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
  );
}

export default App;
