import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const OrderSummary = ({ cart, totalAmount }) => {
    const { t } = useTranslation();

    return (
        <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-[#0f1524] border border-white/5 rounded-[24px] p-[32px] shadow-2xl flex flex-col gap-5"
        >
            <h2 className="font-display text-[18px] font-bold text-white">{t('checkout.your_order')}</h2>
            
            {/* Cart items preview */}
            <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto pr-1">
                {cart.map(item => (
                    <div key={item._id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[10px] bg-[#1a2133] overflow-hidden shrink-0">
                            <img src={item.image?.startsWith('http') ? item.image : item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500">x{item.quantity}</p>
                        </div>
                        <span className="text-[14px] font-bold text-white shrink-0">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-[13px] text-slate-400">
                    <span>{t('checkout.subtotal')}</span>
                    <span>${totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px] text-slate-400">
                    <span>{t('checkout.shipping')}</span>
                    <span className="text-[#4ade80]">{t('checkout.free')}</span>
                </div>
                <div className="flex justify-between text-[16px] font-bold text-white pt-2 border-t border-white/10">
                    <span>{t('checkout.total')}</span>
                    <span>${totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* Security badges */}
            <div className="flex flex-col gap-2 pt-2">
                {['🔒 Paiement 256-bit SSL', '🛡️ Données protégées', '📦 Livraison gratuite'].map(badge => (
                    <div key={badge} className="flex items-center gap-2 text-[12px] text-slate-500">
                        <span>{badge}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default OrderSummary;
