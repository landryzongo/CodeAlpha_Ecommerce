import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Lock, Check, CreditCard, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { useTranslation } from 'react-i18next';
import PaymentCardForm from '../../components/PaymentCard';

const Checkout = () => {
    const { t } = useTranslation();
    const { cart, totalAmount, clearCart, totalItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        address: user?.address || '',
        city: user?.city || '',
        zip: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'paypal'

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name || '',
                address: user.address || '',
                city: user.city || '',
                zip: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await placeOrder();
    };

    const placeOrder = async () => {
        setLoading(true);
        try {
            if (!cart || cart.length === 0) {
                toast.error("Le panier est vide!");
                setLoading(false);
                return;
            }

            const orderItems = cart.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));

            const orderData = {
                products: orderItems,
                customerName: formData.fullName,
                deliveryAddress: formData.city ? `${formData.address}, ${formData.city} ${formData.zip}` : formData.address,
                paymentMethod: paymentMethod
            };

            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrderId(response.data._id || `NO-${Math.floor(Math.random() * 10000)}`);
            
            setSuccess(true);
            setLoading(false);
            toast.success(`Commande validée !`);

            clearCart();

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la validation de la commande.";
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    // Calculate estimated delivery (e.g. 7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDate = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#020617] relative flex flex-col font-sans text-white">
            {/* Background elements to match mockup */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#667eea] rounded-full blur-[150px] opacity-10"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#764ba2] rounded-full blur-[150px] opacity-10"></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex-grow w-full max-w-6xl mx-auto px-[16px] md:px-[24px] py-[24px] flex flex-col lg:flex-row items-center justify-center gap-[40px] md:gap-[80px]">
                
                {/* Left Card: Form */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-[480px] bg-[#0f1524] border border-white/5 rounded-[24px] p-[24px] md:p-[32px] shadow-2xl shrink-0"
                >
                    <h1 className="font-display text-[24px] font-bold text-white mb-[32px]">{t('checkout.title')}</h1>

                    {/* Order Summary Toggle (Mockup Style) */}
                    <div className="bg-[#1a2133] border border-white/5 rounded-[16px] p-[20px] flex items-center justify-between mb-[32px] cursor-pointer hover:bg-[#20283d] transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[14px] text-slate-300 font-semibold">{t('checkout.summary')}</span>
                            <span className="text-[13px] text-slate-400">{totalItems} {t('checkout.items')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[16px] font-bold text-white">${totalAmount.toLocaleString()}</span>
                            <ChevronDown size={18} className="text-slate-400" />
                        </div>
                    </div>

                    <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-[32px]">
                        
                        {/* Shipping Details */}
                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[13px] text-slate-400 font-semibold mb-[4px]">{t('checkout.shipping_info')}</h2>
                            
                            <div className="bg-[#1a2133] rounded-[12px] p-[12px] pb-[8px] flex flex-col relative focus-within:ring-1 focus-within:ring-[#667eea]">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('checkout.full_name')}</label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="bg-transparent border-none text-[15px] font-semibold text-white focus:outline-none w-full"
                                />
                            </div>

                            <div className="bg-[#1a2133] rounded-[12px] p-[12px] pb-[8px] flex flex-col relative focus-within:ring-1 focus-within:ring-[#667eea]">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('checkout.address')}</label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="bg-transparent border-none text-[15px] font-semibold text-white focus:outline-none w-full"
                                />
                            </div>

                            <div className="flex gap-[12px]">
                                <div className="flex-1 bg-[#1a2133] rounded-[12px] p-[12px] pb-[8px] flex flex-col relative focus-within:ring-1 focus-within:ring-[#667eea]">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('checkout.city')}</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="bg-transparent border-none text-[15px] font-semibold text-white focus:outline-none w-full"
                                    />
                                </div>
                                <div className="w-[100px] shrink-0 bg-[#1a2133] rounded-[12px] p-[12px] pb-[8px] flex flex-col relative focus-within:ring-1 focus-within:ring-[#667eea]">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">ZIP</label>
                                    <input 
                                        type="text" 
                                        id="zip" 
                                        value={formData.zip}
                                        onChange={handleChange}
                                        className="bg-transparent border-none text-[15px] font-semibold text-white focus:outline-none w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[13px] text-slate-400 font-semibold mb-[4px]">{t('checkout.payment')}</h2>
                            <div className="flex gap-[16px] mb-3">
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 rounded-[16px] p-[16px] border ${paymentMethod === 'card' ? 'bg-[#1a2133] border-[#667eea]' : 'bg-[#121827] border-white/5'} flex flex-col items-center justify-center gap-3 relative transition-all`}
                                >
                                    {paymentMethod === 'card' && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#667eea] rounded-full flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                    <CreditCard size={24} className={paymentMethod === 'card' ? "text-white" : "text-slate-400"} />
                                    <span className={`text-[13px] font-bold ${paymentMethod === 'card' ? "text-white" : "text-slate-400"}`}>Carte bancaire</span>
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`flex-1 rounded-[16px] p-[16px] border ${paymentMethod === 'cash' ? 'bg-[#1a2133] border-[#667eea]' : 'bg-[#121827] border-white/5'} flex flex-col items-center justify-center gap-3 relative transition-all`}
                                >
                                    {paymentMethod === 'cash' && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#667eea] rounded-full flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                    <span className={`text-[24px] ${paymentMethod === 'cash' ? '' : 'opacity-40'}`}>💵</span>
                                    <span className={`text-[13px] font-bold ${paymentMethod === 'cash' ? "text-white" : "text-slate-400"}`}>{t('checkout.cash')}</span>
                                </button>
                            </div>

                            {/* Card payment form injected here */}
                            <AnimatePresence>
                                {paymentMethod === 'card' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <PaymentCardForm
                                            onSuccess={placeOrder}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {paymentMethod === 'cash' && (
                            <button 
                                type="submit"
                                form="checkout-form"
                                disabled={loading || cart.length === 0}
                                className={`w-full py-[18px] rounded-[12px] font-sans text-[16px] font-bold transition-all mt-[8px] ${loading || cart.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg hover:opacity-90 active:scale-95'}`}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                    t('checkout.place_order')
                                )}
                            </button>
                        )}
                    </form>
                </motion.div>



                {/* Animated Connecting Dashed Line (Desktop only) */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[40px] pointer-events-none z-0">
                    <svg width="100%" height="100%" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full overflow-visible">
                        <style>
                            {`
                                @keyframes dashFlow {
                                    from { stroke-dashoffset: 24; }
                                    to { stroke-dashoffset: 0; }
                                }
                                .animate-dash {
                                    animation: dashFlow 1.5s linear infinite;
                                }
                            `}
                        </style>
                        {/* Slight upward curve: starts at y=20, peaks at y=5, ends at y=20 */}
                        <path d="M 0 20 Q 50 5 100 20" stroke="#667eea" strokeWidth="2" strokeDasharray="6 6" strokeOpacity="0.5" className="animate-dash" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Right Card: Order Confirmation (Mockup static state) */}
                <div className="w-full lg:w-[480px] shrink-0 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0f1524] border border-white/5 rounded-[24px] p-[40px] flex flex-col items-center justify-center text-center shadow-2xl min-h-[500px] relative overflow-hidden"
                    >
                        {/* Subtle glow behind the checkmark */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-[#667eea] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                        
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8a72ee] to-[#667eea] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(102,126,234,0.4)] relative z-10">
                            <Check size={40} className="text-white" strokeWidth={3} />
                        </div>
                        
                        <h2 className="font-display text-[24px] font-bold text-white mb-2 relative z-10">Order confirmed!</h2>
                        <p className="text-[14px] text-slate-400 mb-8 relative z-10">Order #{orderId?.slice(-6).toUpperCase() || 'NO-2410'}</p>
                        
                        <div className="border border-[#166534] bg-[#0f291e] text-[#4ade80] px-6 py-3 rounded-[12px] text-[14px] font-bold mb-10 relative z-10">
                            Estimated delivery: {formattedDate}
                        </div>

                        <div className="flex flex-col gap-3 w-full relative z-10 mt-auto">
                            <button 
                                onClick={() => navigate('/orders')}
                                className="w-full py-[16px] rounded-[12px] bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-[15px] font-bold shadow-lg hover:opacity-90 transition-all"
                            >
                                View order
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-[16px] rounded-[12px] bg-[#111827] border border-[#1e293b] text-white text-[15px] font-bold hover:bg-[#1f2937] transition-all"
                            >
                                Continue shopping
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
