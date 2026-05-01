import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {
        localStorage.removeItem('userInfo');
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
