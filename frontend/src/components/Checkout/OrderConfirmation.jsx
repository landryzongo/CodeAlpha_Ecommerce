import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = ({ orderId, formattedDate }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0f1524] border border-white/5 rounded-[24px] p-[40px] flex flex-col items-center justify-center text-center shadow-2xl min-h-[500px] relative overflow-hidden"
        >
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-[#667eea] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
            
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8a72ee] to-[#667eea] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(102,126,234,0.4)] relative z-10"
            >
                <Check size={40} className="text-white" strokeWidth={3} />
            </motion.div>
            
            <h2 className="font-display text-[24px] font-bold text-white mb-2 relative z-10">{t('checkout.confirmed_title')}</h2>
            <p className="text-[14px] text-slate-400 mb-8 relative z-10">{t('checkout.confirmed_subtitle')} #{orderId?.slice(-6).toUpperCase() || 'NO-2410'}</p>
            
            <div className="border border-[#166534] bg-[#0f291e] text-[#4ade80] px-6 py-3 rounded-[12px] text-[14px] font-bold mb-10 relative z-10">
                {t('checkout.estimated_delivery')} {formattedDate}
            </div>

            <div className="flex flex-col gap-3 w-full relative z-10 mt-auto">
                <button 
                    onClick={() => navigate('/orders')}
                    className="w-full py-[16px] rounded-[12px] bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-[15px] font-bold shadow-lg hover:opacity-90 transition-all"
                >
                    {t('checkout.view_order')}
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="w-full py-[16px] rounded-[12px] bg-[#111827] border border-[#1e293b] text-white text-[15px] font-bold hover:bg-[#1f2937] transition-all"
                >
                    {t('checkout.continue_shopping')}
                </button>
            </div>
        </motion.div>
    );
};

export default OrderConfirmation;
