import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListOrdered, Users, Settings, LogOut, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggle }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const links = [
        { p: '/admin', n: 'Dashboard', i: <LayoutDashboard size={20} /> },
        { p: '/admin/products', n: 'Produits', i: <ShoppingBag size={20} /> },
        { p: '/admin/orders', n: 'Commandes', i: <ListOrdered size={20} /> },
        { p: '/admin/users', n: 'Utilisateurs', i: <Users size={20} /> },
        { p: '/admin/settings', n: 'Paramètres', i: <Settings size={20} /> },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col p-6 text-white text-sm transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                        <Package size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">AdminPanel</span>
                </div>
                <button onClick={toggle} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-grow space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.p}
                        to={link.p}
                        onClick={() => window.innerWidth < 1024 && toggle()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === link.p
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {link.i}
                        <span>{link.n}</span>
                    </Link>
                ))}
            </nav>

            <button
                onClick={logout}
                className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
                <LogOut size={20} />
                <span>Déconnexion</span>
            </button>
        </aside>
    );
};

const AdminLayout = ({ children }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!isAuthenticated || (user && user.role !== 'admin')) {
        const linkClasses = "inline-block px-6 py-3 rounded-xl font-medium transition-colors shadow-lg";

        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
                <div className="bg-slate-800 p-6 sm:p-10 rounded-3xl border border-slate-700 max-w-md w-full text-center shadow-2xl">
                    <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Package size={32} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4">Accès Restreint</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                        Cette zone est réservée à l'administration. Veuillez vérifier vos identifiants ou retourner vers la boutique.
                    </p>
                    <div className="flex flex-col gap-3">
                        {!isAuthenticated ? (
                            <Link to="/login" className={`${linkClasses} bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20`}>
                                Se connecter
                            </Link>
                        ) : (
                            <Link to="/" className={`${linkClasses} bg-slate-100 hover:bg-slate-200 text-slate-900`}>
                                Retour au site
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-slate-50 h-screen overflow-hidden relative">
            {/* Overlay for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

            <main className="flex-grow flex flex-col min-w-0 h-full">
                <header className="h-16 lg:h-20 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between z-30 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors">
                            <Menu size={20} />
                        </button>
                        <h2 className="text-sm sm:text-lg font-bold text-slate-800 truncate">
                            Admin <span className="hidden sm:inline">| {user?.name || 'Administrateur'}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Rôle</p>
                            <p className="text-xs font-bold text-indigo-600 uppercase">{user?.role || 'Admin'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-200">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 flex-grow overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
