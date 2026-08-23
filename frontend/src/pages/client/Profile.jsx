import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, MapPin, Package, CreditCard, Bell, HelpCircle,
    LogOut, ChevronRight, Edit2, X, Check, ShoppingBag
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../config/api';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { t } = useTranslation();
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        city: user?.city || '',
        address: user?.address || '',
        email: user?.email || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                city: user.city || '',
                address: user.address || '',
                email: user.email || ''
            });
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/orders/myorders`);
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const success = await updateProfile(formData);
        if (success) {
            setEditing(false);
            // Note: toast is already shown by AuthContext.updateProfile
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const settingsLinks = [
        { icon: User, label: 'Personal Information', action: () => setEditing(true) },
        { icon: MapPin, label: 'My Addresses', action: () => {} },
        { icon: Package, label: 'My Orders', action: () => navigate('/orders') },
        { icon: CreditCard, label: 'Payment Methods', action: () => {} },
        { icon: Bell, label: 'Notifications', action: () => {} },
        { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    ];

    if (!user) {
        return (
            <main className="flex-grow px-[16px] md:px-[40px] py-[40px] md:py-[80px] flex flex-col justify-center items-center w-full">
                <div className="glass-card w-full max-w-lg rounded-[24px] p-8 flex flex-col items-center text-center gap-4">
                    <User size={48} className="text-slate-500" />
                    <h2 className="font-display text-[24px] font-bold text-white">Not logged in</h2>
                    <p className="font-sans text-[16px] text-slate-400">Login to view your profile and orders.</p>
                    <Link to="/login" className="mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] font-sans text-[14px] text-white font-bold">
                        Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow px-[16px] md:px-[40px] py-[32px] md:py-[40px] max-w-3xl mx-auto w-full flex flex-col pb-[120px]">
            {/* Profile Header Card */}
            <section className="flex flex-col items-center mt-[16px] mb-[40px]">
                    {/* Avatar */}
                    <div className="relative group mb-[20px]">
                        <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-[0_0_30px_rgba(102,126,234,0.35)] transition-all group-hover:shadow-[0_0_40px_rgba(118,75,162,0.5)]">
                            <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center text-[#667eea] text-[40px] font-display font-bold overflow-hidden border-2 border-[#020617]">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>
                        <button
                            onClick={() => setEditing(true)}
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#23293c] border border-white/10 flex items-center justify-center text-[#667eea] shadow-lg hover:bg-white/10 transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>

                    <h1 className="font-display text-[28px] font-bold text-white">{user.name}</h1>
                    <p className="font-sans text-[16px] text-slate-400 mb-[24px]">{user.email}</p>

                    <div className="flex gap-[32px] glass-card rounded-[20px] px-[32px] py-[16px] w-full justify-center">
                        <div className="flex flex-col items-center">
                            <span className="font-display text-[24px] font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{orders.length}</span>
                            <span className="font-sans text-[12px] text-slate-400 font-semibold">Orders</span>
                        </div>
                        <div className="w-px bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-display text-[24px] font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                {orders.filter(o => o.status === 'completed').length}
                            </span>
                            <span className="font-sans text-[12px] text-slate-400 font-semibold">Delivered</span>
                        </div>
                        <div className="w-px bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-display text-[24px] font-bold text-[#667eea]">
                                {user.role === 'admin' ? '⭐' : '★'}
                            </span>
                            <span className="font-sans text-[12px] text-slate-400 font-semibold">{user.role === 'admin' ? 'Admin' : 'Member'}</span>
                        </div>
                    </div>
                </section>

                {/* Edit Form Modal */}
                <AnimatePresence>
                    {editing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
                            onClick={(e) => { if (e.target === e.currentTarget) setEditing(false); }}
                        >
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="w-full max-w-[480px] bg-[#0f172a] border-t border-white/10 rounded-t-[24px] p-[24px] pb-[48px]"
                            >
                                <div className="flex items-center justify-between mb-[24px]">
                                    <h2 className="font-display text-[20px] font-bold text-white">{t('profile.edit')}</h2>
                                    <button onClick={() => setEditing(false)} className="w-8 h-8 flex items-center justify-center rounded-full glass-card text-slate-400 hover:text-white transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                                <form onSubmit={handleUpdate} className="flex flex-col gap-[16px]">
                                    {[
                                        { id: 'name', label: 'Full Name', type: 'text' },
                                        { id: 'city', label: 'City', type: 'text' },
                                        { id: 'address', label: 'Address', type: 'text' },
                                    ].map(field => (
                                        <div key={field.id} className="relative group">
                                            <input
                                                type={field.type}
                                                id={field.id}
                                                value={formData[field.id]}
                                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                placeholder=" "
                                                className="w-full bg-[#23293c]/50 border border-white/10 rounded-[12px] px-[16px] pt-[24px] pb-[8px] text-white focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] focus:bg-[#23293c] transition-all peer"
                                            />
                                            <label
                                                htmlFor={field.id}
                                                className="absolute text-slate-400 text-[14px] duration-300 transform -translate-y-3 scale-75 top-[16px] z-10 origin-[0] left-[16px] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#667eea]"
                                            >
                                                {field.label}
                                            </label>
                                        </div>
                                    ))}
                                    <button
                                        type="submit"
                                        className="w-full py-[16px] rounded-[16px] bg-gradient-to-r from-[#667eea] to-[#764ba2] font-sans text-[16px] font-bold text-white flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all mt-[8px]"
                                    >
                                        <Check size={20} />
                                        {t('profile.save')}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Settings List */}
                <section className="flex flex-col gap-[12px]">
                    {settingsLinks.map((item, i) => (
                        <button
                            key={i}
                            onClick={item.action}
                            className="glass-card rounded-[16px] p-[16px] flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(118,75,162,0.15)] w-full text-left"
                        >
                            <div className="flex items-center gap-[16px]">
                                <div className="w-10 h-10 rounded-[10px] bg-white/5 flex items-center justify-center text-[#667eea] group-hover:text-white transition-colors">
                                    <item.icon size={20} />
                                </div>
                                <span className="font-sans text-[16px] text-white group-hover:text-white transition-colors">{item.label}</span>
                            </div>
                            <ChevronRight size={20} className="text-slate-500 group-hover:text-[#667eea] transition-colors" />
                        </button>
                    ))}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="glass-card rounded-[16px] p-[16px] flex items-center justify-center gap-[12px] w-full hover:-translate-y-1 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(255,100,100,0.1)] active:scale-95 group mt-[8px]"
                    >
                        <LogOut size={20} className="text-red-400 group-hover:text-red-300 transition-colors" />
                        <span className="font-sans text-[16px] font-bold text-red-400 group-hover:text-red-300 transition-colors">{t('profile.logout')}</span>
                    </button>
                </section>
            </main>
    );
};

export default Profile;
