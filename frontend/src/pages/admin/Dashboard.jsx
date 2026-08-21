import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-xl ${color} bg-opacity-10`}>
                {React.cloneElement(icon, { size: 20, className: `text-${color.split('-')[1]}-600` })}
            </div>
            {trend && (
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <h3 className="text-slate-500 text-[10px] sm:text-sm uppercase tracking-wider font-bold">{title}</h3>
        <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{value}</p>
    </div>
);

const Dashboard = () => {
    const { getAuthenticatedAxios } = useAuth();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        conversionRate: 0
    });
    const [salesData, setSalesData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            const [ordersRes, usersRes] = await Promise.all([
                api.get('/orders'),
                api.get('/users')
            ]);

            const orders = ordersRes.data;
            const users = usersRes.data;

            const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const totalOrders = orders.length;
            const totalUsers = users.length;
            const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : 0;

            setStats({
                totalSales,
                totalOrders,
                totalUsers,
                conversionRate
            });

            const last7Days = [];
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'short' });

                const dayOrders = orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.toDateString() === date.toDateString();
                });

                const daySales = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                last7Days.push({
                    name: dateStr,
                    sales: daySales,
                    orders: dayOrders.length
                });
            }

            setSalesData(last7Days);
            setOrdersData(last7Days);
        } catch (err) {
            console.error('Erreur lors du chargement des données du dashboard:', err);
            setStats({ totalSales: 0, totalOrders: 0, totalUsers: 0, conversionRate: 0 });
            setSalesData([]);
            setOrdersData([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-slate-400 font-bold animate-pulse text-sm">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard
                    title="Ventes"
                    value={`${stats.totalSales.toLocaleString()} F`}
                    icon={<DollarSign />}
                    color="bg-emerald-500"
                    trend={12}
                />
                <StatCard
                    title="Commandes"
                    value={stats.totalOrders}
                    icon={<ShoppingCart />}
                    color="bg-indigo-500"
                    trend={8}
                />
                <StatCard
                    title="Clients"
                    value={stats.totalUsers}
                    icon={<Users />}
                    color="bg-amber-500"
                    trend={15}
                />
                <StatCard
                    title="Conversion"
                    value={`${stats.conversionRate}%`}
                    icon={<TrendingUp />}
                    color="bg-rose-500"
                    trend={-2}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm sm:text-lg font-black text-slate-900 mb-6">Aperçu des Ventes</h3>
                    <div className="h-60 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                    formatter={(value) => [`${value.toLocaleString()} F`, 'Ventes']}
                                />
                                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm sm:text-lg font-black text-slate-900 mb-6">Volume Hebdomadaire</h3>
                    <div className="h-60 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ordersData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                                />
                                <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm sm:text-lg font-black text-slate-900 mb-6">Activité Récente</h3>
                <div className="space-y-3 sm:space-y-4">
                    {salesData.slice(-5).reverse().map((day, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="min-w-0">
                                <div className="font-bold text-slate-900 text-sm sm:text-base">{day.name}</div>
                                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{day.orders} commande(s)</div>
                            </div>
                            <div className="text-right">
                                <div className="font-black text-indigo-600 text-sm sm:text-base">{day.sales.toLocaleString()} F</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
