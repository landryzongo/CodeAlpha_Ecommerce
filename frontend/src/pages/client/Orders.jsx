import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, ChevronRight, ShoppingBag, Check, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { useTranslation } from 'react-i18next';

const STATUS_CONFIG = {
    completed: {
        label: 'Completed',
        color: '#22c55e',
        bg: 'rgba(34,197,94,0.10)',
        border: 'rgba(34,197,94,0.20)',
        showCheck: true,
    },
    pending: {
        label: 'Pending',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.10)',
        border: 'rgba(245,158,11,0.20)',
        showCheck: false,
    },
    processing: {
        label: 'Processing',
        color: '#667eea',
        bg: 'rgba(102,126,234,0.10)',
        border: 'rgba(102,126,234,0.20)',
        showCheck: false,
    },
    cancelled: {
        label: 'Cancelled',
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.10)',
        border: 'rgba(239,68,68,0.20)',
        showCheck: false,
    },
};

const filters = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

const Orders = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [hoveredOrder, setHoveredOrder] = useState(null);
    const filterRefs = useRef([]);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Animate underline to the active filter tab
    useEffect(() => {
        const activeIdx = filters.indexOf(activeFilter);
        const el = filterRefs.current[activeIdx];
        if (el) {
            setUnderlineStyle({ left: el.offsetLeft, width: el.offsetWidth });
        }
    }, [activeFilter]);

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

    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'All') return true;
        return order.status?.toLowerCase() === activeFilter.toLowerCase();
    });

    if (!user) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col">
                <main className="flex-grow px-[16px] md:px-[40px] py-[40px] md:py-[80px] flex flex-col justify-center items-center w-full">
                    <div className="bg-[#0f1524] border border-white/5 rounded-[24px] p-[40px] flex flex-col items-center justify-center text-center mt-4">
                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                            <Package size={28} className="text-slate-500" />
                        </div>
                        <h2 className="font-display text-[24px] font-bold text-white mb-2">Login Required</h2>
                        <p className="font-sans text-[14px] text-slate-400 mb-6">You need to log in to see your orders.</p>
                        <Link to="/login" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] font-sans text-[13px] text-white font-bold">
                            Login
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col">

            {/* Subtle background glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#667eea] rounded-full blur-[150px] opacity-[0.06]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#764ba2] rounded-full blur-[150px] opacity-[0.06]"></div>
            </div>

            <main className="relative z-10 flex-grow w-full max-w-[1120px] mx-auto px-[16px] py-[32px] md:py-[40px] flex flex-col pb-[100px]">

                {/* Header */}
                <div className="flex items-center gap-[12px] mb-[28px]">
                    <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="font-display text-[24px] font-bold text-white">{t('orders.title')}</h1>
                    <span className="ml-auto font-sans text-[13px] text-slate-500">{orders.length} {t('orders.items')}</span>
                </div>

                {/* Filter Tabs with sliding underline */}
                <div className="relative mb-[20px]">
                    <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
                        {filters.map((f, idx) => (
                            <button
                                key={f}
                                ref={el => filterRefs.current[idx] = el}
                                onClick={() => setActiveFilter(f)}
                                className={`whitespace-nowrap px-[16px] h-[36px] font-sans text-[13px] font-semibold transition-all shrink-0 ${
                                    activeFilter === f ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    {/* Bottom border base */}
                    <div className="h-[1px] bg-white/10 w-full mt-0"></div>
                    {/* Animated underline */}
                    <motion.div
                        className="absolute bottom-0 h-[2px] rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                        animate={{ left: underlineStyle.left, width: underlineStyle.width }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-[#0f1524] border border-white/5 rounded-[20px] p-[40px] flex flex-col items-center justify-center text-center mt-4">
                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                            <ShoppingBag size={28} className="text-slate-500" />
                        </div>
                        <h3 className="font-display text-[18px] font-bold text-white mb-2">{t('orders.empty')}</h3>
                        <p className="font-sans text-[14px] text-slate-400 mb-6">
                            {t('orders.empty_sub')}
                        </p>
                        <Link to="/" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] font-sans text-[13px] text-white font-bold">
                            {t('cart.browse')}
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[8px]">
                        <AnimatePresence>
                            {filteredOrders.map((order, idx) => {
                                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                const isCancelled = order.status === 'cancelled';
                                const productsArray = order.products || [];
                                const firstItem = productsArray[0]?.product;
                                const extraCount = productsArray.length > 1 ? productsArray.length - 1 : 0;
                                const isHovered = hoveredOrder === order._id;

                                return (
                                    <motion.article
                                        key={order._id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        transition={{ delay: idx * 0.06 }}
                                        onMouseEnter={() => setHoveredOrder(order._id)}
                                        onMouseLeave={() => setHoveredOrder(null)}
                                        className={`bg-[#0f1524] border border-white/5 rounded-[16px] p-[16px] flex flex-row items-center gap-[14px] cursor-pointer transition-all hover:border-white/10 hover:bg-[#121929] ${isCancelled ? 'opacity-60' : ''}`}
                                    >
                                        {/* Bloc Vignette (Gauche) */}
                                        <div className="relative shrink-0 w-[60px] h-[60px]">
                                            <div className="w-[60px] h-[60px] rounded-[12px] bg-[#1a2133] overflow-hidden flex items-center justify-center">
                                                {firstItem?.image ? (
                                                    <img src={firstItem.image} alt={firstItem.name} className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    <Package size={24} className="text-slate-500" />
                                                )}
                                            </div>
                                            {/* Badge "+N" si plusieurs articles */}
                                            {extraCount > 0 && (
                                                <div className="absolute -top-1 -right-1 w-[20px] h-[20px] rounded-full bg-[#1a2133]/90 border border-white/10 flex items-center justify-center">
                                                    <span className="font-sans text-[9px] font-bold text-white">+{extraCount}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bloc Infos (Milieu) */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                                            {/* Ligne 1 : Nom principal */}
                                            <p className="font-display text-[15px] font-semibold text-white truncate leading-tight">
                                                {firstItem?.name || 'Order'}
                                                {extraCount > 0 && (
                                                    <span className="text-slate-500 font-sans font-normal"> + {extraCount} other{extraCount > 1 ? 's' : ''}</span>
                                                )}
                                            </p>
                                            {/* Ligne 2 : Items count + Order ID */}
                                            <p className="font-sans text-[12px] text-slate-500 leading-tight">
                                                {productsArray.length || 1} item{productsArray.length > 1 ? 's' : ''} • #{order._id.slice(-6).toUpperCase()}
                                            </p>
                                            {/* Ligne 3 : Date */}
                                            <p className="font-sans text-[12px] text-slate-500 leading-tight">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>

                                            {/* Bouton "Order again" au hover */}
                                            <AnimatePresence>
                                                {isHovered && !isCancelled && (
                                                    <motion.button
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 4 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="mt-[6px] self-start flex items-center gap-1.5 px-[10px] py-[4px] rounded-full border text-[11px] font-semibold font-sans transition-all"
                                                        style={{
                                                            borderColor: 'rgba(102,126,234,0.4)',
                                                            color: '#667eea',
                                                            background: 'rgba(102,126,234,0.06)',
                                                        }}
                                                        onClick={(e) => { e.stopPropagation(); navigate('/'); }}
                                                    >
                                                        <RefreshCw size={10} />
                                                        Order again
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Bloc Prix & Statut (Droite) */}
                                        <div className="flex flex-col items-end gap-[8px] shrink-0">
                                            {/* Total avec dégradé */}
                                            <span
                                                className="font-sans text-[18px] font-bold"
                                                style={isCancelled ? { color: '#64748b', textDecoration: 'line-through' } : {
                                                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                }}
                                            >
                                                ${order.totalPrice?.toLocaleString()}
                                            </span>

                                            {/* Badge Statut */}
                                            <span
                                                className="flex items-center gap-[4px] font-sans text-[11px] font-semibold px-[12px] py-[4px] rounded-[12px]"
                                                style={{
                                                    color: statusCfg.color,
                                                    background: statusCfg.bg,
                                                    border: `1px solid ${statusCfg.border}`,
                                                }}
                                            >
                                                {statusCfg.showCheck && <Check size={10} strokeWidth={3} />}
                                                {t(`orders.${order.status?.toLowerCase()}`) || statusCfg.label}
                                            </span>

                                            {/* Chevron */}
                                            <ChevronRight
                                                size={16}
                                                className="transition-transform"
                                                style={{ color: isHovered ? '#667eea' : '#475569', transform: isHovered ? 'translateX(2px)' : 'none' }}
                                            />
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Orders;

