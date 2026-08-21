import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User as UserIcon, Home, Grid, ShoppingBag, Receipt, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Determine active tab for Bottom Nav
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* --- TOP NAVBAR (Desktop & Mobile) --- */}
            <header className="sticky top-0 z-50 w-full px-[16px] md:px-[40px] py-[4px] md:py-[6px] bg-[#020617]/90 backdrop-blur-[24px] border-b border-white/10 flex flex-col md:flex-row justify-between items-center transition-all gap-2 md:gap-4">
                
                {/* Logo Section */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <Link to="/" className="flex flex-col justify-center group shrink-0 w-auto leading-none">
                        <img src="/logo.png" alt="NovaTech" className="w-[120px] md:w-[150px] h-auto object-contain group-hover:scale-105 transition-transform origin-left" />
                        <span className="font-sans text-[9px] text-slate-400 font-semibold tracking-wide hidden md:block pl-1 mt-[2px]">
                            Discover. Shop. Upgrade.
                        </span>
                    </Link>
                    
                    {/* Mobile Search & User (Visible only on mobile, replacing desktop placement) */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <Search size={24} />
                        </button>
                        <Link to="/login" className="p-2 text-slate-400 hover:text-white transition-colors">
                            <UserIcon size={24} />
                        </Link>
                    </div>
                </div>

                {/* Search Section (Center) */}
                <div className="hidden md:flex flex-1 justify-center max-w-xl mx-[24px]">
                    <form onSubmit={handleSearch} className="relative group w-full flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for tech gadgets, ideas and more"
                            className="w-full pl-5 pr-10 py-[8px] rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:border-[#667eea] transition-all font-sans text-[13px]"
                        />
                        <button type="submit" className="absolute right-2 w-7 h-7 rounded-full bg-[#1a1c29] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#667eea] transition-colors">
                            <Search size={14} />
                        </button>
                    </form>
                </div>

                {/* Navigation Links & Action Icons Section (Right) */}
                <div className="hidden md:flex items-center gap-[24px]">
                    
                    <nav className="flex items-center gap-[20px]">
                        <Link to="/" className={`font-sans text-[14px] font-bold transition-colors relative ${isActive('/') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                            Home
                            {isActive('/') && <div className="absolute -bottom-[20px] left-0 right-0 h-[2px] bg-[#667eea]"></div>}
                        </Link>
                        <Link to="/" className="font-sans text-[14px] font-semibold text-slate-400 hover:text-white transition-colors">Today</Link>
                        <Link to="/" className="font-sans text-[14px] font-semibold text-slate-400 hover:text-white transition-colors">Following</Link>
                        <Link to="/" className="font-sans text-[14px] font-semibold text-slate-400 hover:text-white transition-colors">Shop</Link>
                    </nav>

                    <div className="w-px h-6 bg-white/10"></div>

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors group">
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* User / Avatar */}
                    <div className="relative" ref={userMenuRef}>
                        {user ? (
                            <>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2 text-slate-400 hover:text-white transition-colors group flex items-center gap-2"
                                >
                                    <UserIcon size={24} className="group-hover:scale-110 transition-transform" />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-4 w-48 py-2 bg-[#0c1324] rounded-2xl shadow-2xl border border-white/10 z-[110]"
                                        >
                                            <div className="px-4 py-2 border-b border-white/10">
                                                <p className="text-xs text-slate-400">Signed in as</p>
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                                            >
                                                <UserIcon size={16} />
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                                            >
                                                <LogOut size={16} />
                                                Log out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <Link to="/login" className="p-2 text-slate-400 hover:text-white transition-colors group">
                                <UserIcon size={24} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* --- BOTTOM NAVBAR (Mobile Only) --- */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] flex justify-around items-center px-2 py-3 pb-safe bg-[#020617]/80 backdrop-blur-[24px] border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
                
                <Link to="/" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all active:scale-90 ${isActive('/') ? 'text-[#667eea] bg-[#667eea]/20' : 'text-slate-400 hover:text-[#667eea]'}`}>
                    <Home size={24} />
                    <span className="font-sans text-[10px] font-semibold mt-1">Home</span>
                </Link>

                <Link to="/?category=all" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#667eea] transition-all active:scale-90 px-3 py-1">
                    <Grid size={24} />
                    <span className="font-sans text-[10px] font-semibold mt-1">Categories</span>
                </Link>

                <Link to="/cart" className={`relative flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all active:scale-90 ${isActive('/cart') ? 'text-[#667eea] bg-[#667eea]/20' : 'text-slate-400 hover:text-[#667eea]'}`}>
                    <ShoppingBag size={24} />
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-3 bg-red-500 text-white text-[8px] font-bold h-3 w-3 rounded-full flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                    <span className="font-sans text-[10px] font-semibold mt-1">Cart</span>
                </Link>

                <Link to="/orders" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all active:scale-90 ${isActive('/orders') ? 'text-[#667eea] bg-[#667eea]/20' : 'text-slate-400 hover:text-[#667eea]'}`}>
                    <Receipt size={24} />
                    <span className="font-sans text-[10px] font-semibold mt-1">Orders</span>
                </Link>

                <Link to="/profile" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all active:scale-90 ${isActive('/profile') ? 'text-[#667eea] bg-[#667eea]/20' : 'text-slate-400 hover:text-[#667eea]'}`}>
                    <UserIcon size={24} />
                    <span className="font-sans text-[10px] font-semibold mt-1">Profile</span>
                </Link>

            </nav>
        </>
    );
};

export default Navbar;
