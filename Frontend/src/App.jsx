import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import InnovationFeed from './pages/InnovationFeed';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Contact from './pages/Contact';
import Messages from './pages/Messages';
import Requests from './pages/Requests';
import Notifications from './pages/Notifications';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
    const location = useLocation();
    const isMessagesPage = location.pathname.startsWith('/messages');

    return (
        <div className={isMessagesPage ? 'd-flex flex-column vh-100' : ''}>
            {!isMessagesPage && <AppNavbar />}
            <main className={isMessagesPage ? 'flex-grow-1 overflow-hidden' : 'py-3'}>
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
