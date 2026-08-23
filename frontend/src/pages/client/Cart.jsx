import React from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Heart, Lock, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


const Cart = () => {
    const { cart, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
    const navigate = useNavigate();

    const handleCheckoutClick = () => {
        navigate('/checkout');
    };

    const getImageUrl = (image) => {
        if (!image) return '/placeholder.png';
        if (image.startsWith('http')) return image;
        return image;
    };

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDate = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (cart.length === 0) {
        return (
            <main className="flex-grow px-[16px] md:px-[40px] py-[40px] md:py-[80px] flex flex-col justify-center items-center w-full min-h-screen bg-[#020617]">
                <div className="bg-[#0f1524] border border-white/5 rounded-[24px] p-[24px] w-full max-w-lg flex flex-col items-center justify-center text-center py-[64px] shadow-[0_20px_60px_-8px_rgba(102,126,234,0.15)]">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                        <ShoppingBag size={32} className="text-slate-400" />
                    </div>
                    <h3 className="font-display text-[24px] font-bold text-white mb-2">Your cart is empty</h3>
                    <p className="font-sans text-[16px] text-slate-400 mb-6">Looks like you haven't added anything yet.</p>
                    <Link to="/" className="px-6 py-3 rounded-[16px] bg-gradient-to-r from-[#667eea] to-[#764ba2] font-sans text-[16px] text-white font-bold hover:brightness-110 transition-all inline-flex">
                        Browse Products
                    </Link>
                </div>
            </main>
        );
    }

    const shippingCost = 0;
    const tax = 0; // Assuming 0 for now as per design
    const grandTotal = totalAmount + shippingCost + tax;

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col">
            {/* Simple Navbar (Logo Only) */}
            <header className="relative z-10 w-full px-[16px] md:px-[40px] py-[20px] flex items-center bg-[#020617]/90 backdrop-blur-[24px] border-b border-white/5 sticky top-0">
                <Link to="/" className="flex flex-col justify-center group shrink-0 w-auto leading-none">
                    <img src="/logo.png" alt="NovaTech" className="w-[120px] md:w-[150px] h-auto object-contain group-hover:scale-105 transition-transform origin-left" />
                    <span className="font-sans text-[9px] text-slate-400 font-semibold tracking-wide hidden md:block pl-1 mt-[2px]">
                        Discover. Shop. Upgrade.
                    </span>
                </Link>
            </header>

            <main className="relative flex-grow w-full max-w-[1120px] mx-auto px-[16px] md:px-[24px] py-[32px] md:py-[40px] flex flex-col lg:flex-row items-start justify-center">
                
                {/* Left side: Cart Items List (65%) */}
                <div className="w-full lg:w-[65%] lg:pr-[24px] flex flex-col">
                    
                    {/* Header */}
                    <div className="h-[56px] flex items-center gap-[12px] mb-[16px]">
                        <button onClick={() => navigate(-1)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[#667eea] hover:bg-white/10 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="font-display text-[24px] font-semibold text-white">Your Cart</h2>
                        <span className="font-sans text-[14px] text-slate-400">
                            ({totalItems} items)
                        </span>
                    </div>

                    <div className="flex flex-col gap-[12px] w-full">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-auto md:h-[120px] bg-[#0f1524] border border-white/5 rounded-[20px] p-[16px] flex flex-col md:flex-row items-start md:items-center gap-[16px] hover:-translate-y-[2px] transition-transform"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-[80px] h-[80px] bg-[#1a2133] rounded-[14px] shrink-0 overflow-hidden">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Info Block */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                                        <h3 className="font-display text-[16px] font-bold text-white truncate">{item.name}</h3>
                                        <p className="font-sans text-[12px] text-[#22c55e] mt-1">Estimated delivery: {formattedDate}</p>
                                    </div>
                                    
                                    {/* Price & Actions Block */}
                                    <div className="flex flex-col md:items-end justify-between h-full gap-3 md:gap-0 mt-2 md:mt-0 w-full md:w-auto">
                                        <span className="font-sans text-[16px] font-bold text-white text-right w-full md:w-auto">
                                            ${(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                        </span>
                                        
                                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 h-[28px] border border-white/10 shrink-0">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="font-sans text-[13px] font-bold text-white w-4 text-center leading-none">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            
                                            {/* Action Icons */}
                                            <div className="flex items-center gap-2">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                                    <Heart size={16} />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {/* Promo Code Link */}
                        <div className="mt-4">
                            <button className="font-sans font-medium text-[14px] text-slate-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] transition-all text-left">
                                + Add promo code
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: Checkout Summary (35%) */}
                <div className="w-full lg:w-[35%] shrink-0 mt-8 lg:mt-0">
                    <div className="bg-[#0f1524] border border-white/5 rounded-[24px] p-[32px] sticky top-[24px] shadow-[0_20px_60px_-8px_rgba(102,126,234,0.15)] flex flex-col gap-[20px]">
                        
                        {/* Price Lines */}
                        <div className="flex flex-col gap-[16px]">
                            <div className="flex justify-between items-center">
                                <span className="font-sans text-[16px] text-slate-400">Subtotal</span>
                                <span className="font-sans text-[16px] font-semibold text-white">${totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-sans text-[16px] text-slate-400">Tax</span>
                                <span className="font-sans text-[16px] font-semibold text-white">${tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-sans text-[16px] text-slate-400">Shipping</span>
                                <span className="font-sans text-[16px] font-semibold text-white">
                                    {shippingCost === 0 ? 'Free' : `$${shippingCost}`}
                                </span>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-[1px] bg-white/20 w-full"></div>

                        {/* Total */}
                        <div className="flex justify-between items-end mb-[4px]">
                            <span className="font-display text-[18px] font-bold text-white mb-[4px]">Total Amount</span>
                            <span className="font-display text-[28px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] to-[#764ba2] leading-none">
                                ${grandTotal.toLocaleString()}
                            </span>
                        </div>

                        {/* Main Button */}
                        <button 
                            onClick={handleCheckoutClick}
                            className="relative w-full h-[56px] rounded-[16px] bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center font-display text-[16px] font-bold text-white overflow-hidden group transition-transform active:scale-95 hover:brightness-110"
                        >
                            {/* Shine effect pseudo-element mimicking via absolute div */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <span className="relative z-10">Proceed to Checkout</span>
                        </button>
                        
                        {/* Security & Badges */}
                        <div className="flex flex-col items-center gap-4 mt-2">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Lock size={14} />
                                <span className="font-sans text-[12px]">Secure Encrypted Checkout</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-[32px] px-3 bg-[#1a2133] border border-white/5 rounded-[8px] flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">VISA</span>
                                </div>
                                <div className="h-[32px] px-3 bg-[#1a2133] border border-white/5 rounded-[8px] flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">MASTERCARD</span>
                                </div>
                                <div className="h-[32px] px-3 bg-[#1a2133] border border-white/5 rounded-[8px] flex items-center justify-center flex-col leading-none">
                                    <span className="text-[10px] font-bold text-white italic">PayPal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <style>
                {`
                    @keyframes shimmer {
                        100% { transform: translateX(100%); }
                    }
                `}
            </style>
        </div>
    );
};

export default Cart;
