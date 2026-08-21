import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Clock, XCircle, Search, Eye, Package, X } from 'lucide-react';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
    const { getAuthenticatedAxios } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            const res = await api.get('/orders');
            setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error('Erreur lors du chargement des commandes:', err);
            alert('Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            await api.put(`/orders/${orderId}`, { status: newStatus });
            await fetchOrders();
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const openDetailModal = async (order) => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            // Récupérer les détails complets avec populate
            const res = await api.get(`/orders/${order._id}`);
            setSelectedOrder(res.data);
            setIsDetailModalOpen(true);
        } catch (err) {
            console.error('Erreur lors du chargement des détails:', err);
            setSelectedOrder(order);
            setIsDetailModalOpen(true);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-amber-500" />;
            case 'processing': return <Package size={16} className="text-blue-500" />;
            case 'completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
            case 'cancelled': return <XCircle size={16} className="text-rose-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600';
            case 'processing': return 'bg-blue-50 text-blue-600';
            case 'completed': return 'bg-emerald-50 text-emerald-600';
            case 'cancelled': return 'bg-rose-50 text-rose-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerWhatsApp?.includes(searchQuery) ||
            order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order._id.includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        completed: orders.filter(o => o.status === 'completed').length,
        totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">Suivi des Commandes</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Gérez les commandes reçues via WhatsApp.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-600">Live</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] lg:text-xs uppercase font-black text-slate-400 mb-1">Total</div>
                    <div className="text-lg sm:text-2xl font-black text-slate-900">{stats.total}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] lg:text-xs uppercase font-black text-amber-500 mb-1">Attente</div>
                    <div className="text-lg sm:text-2xl font-black text-amber-600">{stats.pending}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] lg:text-xs uppercase font-black text-blue-500 mb-1">Cours</div>
                    <div className="text-lg sm:text-2xl font-black text-blue-600">{stats.processing}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] lg:text-xs uppercase font-black text-emerald-500 mb-1">Fait</div>
                    <div className="text-lg sm:text-2xl font-black text-emerald-600">{stats.completed}</div>
                </div>
                <div className="col-span-2 md:col-span-1 bg-white p-3 sm:p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] lg:text-xs uppercase font-black text-indigo-500 mb-1">Chiffre</div>
                    <div className="text-lg sm:text-2xl font-black text-indigo-600 whitespace-nowrap">{stats.totalAmount.toLocaleString()} F</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Client, téléphone ou ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full lg:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="processing">En cours</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Client</th>
                                <th className="hidden md:table-cell px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Articles</th>
                                <th className="px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Total</th>
                                <th className="px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Statut</th>
                                <th className="px-4 py-4 text-right text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center text-slate-400 text-sm">
                                        {searchQuery || filterStatus !== 'all' ? 'Aucune commande trouvée' : 'Aucune commande.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="min-w-0">
                                                <div className="font-black text-slate-900 text-sm sm:text-base truncate">{order.customerName || 'Inconnu'}</div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                    <a
                                                        href={`https://wa.me/${order.customerWhatsApp?.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 font-bold hover:underline flex items-center gap-1 text-[10px] lg:text-xs"
                                                    >
                                                        {order.customerWhatsApp}
                                                        <ExternalLink size={10} />
                                                    </a>
                                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-4">
                                            <div className="text-xs text-slate-600 font-medium">
                                                {order.items?.length > 0 ? (
                                                    <div className="truncate max-w-[200px]">
                                                        {order.items.map(i => i.productId?.name || 'Art').join(', ')}
                                                    </div>
                                                ) : '—'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-black text-slate-700 text-sm sm:text-base">
                                                {order.totalAmount?.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 whitespace-nowrap">F</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="text-[9px] lg:text-[10px] font-black uppercase hidden sm:inline">
                                                    {order.status === 'pending' ? 'Attente' : order.status === 'processing' ? 'Cours' : order.status === 'completed' ? 'Fait' : 'Annulé'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button
                                                onClick={() => openDetailModal(order)}
                                                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {isDetailModalOpen && selectedOrder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col"
                            >
                                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div>
                                        <h2 className="text-base sm:text-xl font-black text-slate-900">Détails Commande</h2>
                                        <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">ID: {selectedOrder._id}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsDetailModalOpen(false)}
                                        className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Informations</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-slate-500">Date:</span>
                                                    <span className="text-xs font-bold text-slate-900">{new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Statut:</span>
                                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(selectedOrder.status)}`}>
                                                        {selectedOrder.status === 'pending' ? 'Attente' : selectedOrder.status === 'processing' ? 'Cours' : selectedOrder.status === 'completed' ? 'Fait' : 'Annulé'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Client</p>
                                            <div className="space-y-1 text-xs">
                                                <p className="font-bold text-slate-900">{selectedOrder.customerName || 'N/A'}</p>
                                                <a href={`https://wa.me/${selectedOrder.customerWhatsApp?.replace(/[^0-9]/g, '')}`} target="_blank" className="text-indigo-600 font-bold flex items-center gap-1">
                                                    {selectedOrder.customerWhatsApp} <ExternalLink size={10} />
                                                </a>
                                                <p className="text-slate-500 italic mt-1">{selectedOrder.deliveryAddress || 'Pas d\'adresse'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 mb-3 flex items-center gap-2">
                                            Articles <span className="h-px flex-grow bg-slate-100"></span>
                                        </p>
                                        <div className="space-y-2">
                                            {selectedOrder.items?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl">
                                                    <img
                                                        src={item.productId?.image?.startsWith('/uploads/') ? `${API_BASE_URL.replace(/\/api$/, '')}${item.productId.image}` : (item.productId?.image || 'https://via.placeholder.com/64')}
                                                        className="w-12 h-12 rounded-xl object-cover"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64'; }}
                                                    />
                                                    <div className="flex-grow min-w-0">
                                                        <p className="text-xs font-black text-slate-900 truncate">{item.productId?.name || 'Produit'}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.price?.toLocaleString() || item.productId?.price?.toLocaleString()} F × {item.quantity}</p>
                                                    </div>
                                                    <div className="text-xs font-black text-slate-900">
                                                        {((item.price || item.productId?.price || 0) * item.quantity).toLocaleString()} F
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-sm font-black text-slate-900">Total Commande</span>
                                        <span className="text-xl font-black text-indigo-600">{selectedOrder.totalAmount?.toLocaleString()} FCFA</span>
                                    </div>

                                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                                        <p className="text-[10px] uppercase font-black text-indigo-400 mb-3">Changer le statut</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['pending', 'processing', 'completed', 'cancelled'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => updateOrderStatus(selectedOrder._id, status)}
                                                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedOrder.status === status ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                                                >
                                                    {status === 'pending' ? 'Attente' : status === 'processing' ? 'Cours' : status === 'completed' ? 'Fait' : 'Annulé'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
