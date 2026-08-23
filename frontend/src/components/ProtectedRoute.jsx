import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617]">
                <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-400 font-sans">Chargement...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
