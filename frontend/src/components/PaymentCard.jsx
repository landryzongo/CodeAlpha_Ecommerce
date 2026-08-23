import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CreditCard, AlertCircle } from 'lucide-react';

// Detect card network from number
const detectCardType = (number) => {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'visa';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
    if (/^3[47]/.test(n)) return 'amex';
    if (/^6/.test(n)) return 'discover';
    return 'unknown';
};

const CardLogo = ({ type }) => {
    if (type === 'visa') return (
        <span className="font-bold italic text-white tracking-wider text-lg">VISA</span>
    );
    if (type === 'mastercard') return (
        <div className="flex">
            <div className="w-7 h-7 rounded-full bg-[#EB001B] opacity-90" />
            <div className="w-7 h-7 rounded-full bg-[#F79E1B] opacity-90 -ml-3" />
        </div>
    );
    if (type === 'amex') return (
        <span className="font-bold text-white text-lg">AMEX</span>
    );
    return <CreditCard className="text-white/50" size={28} />;
};

const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
};

const PaymentCardForm = ({ onSuccess }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [flipped, setFlipped] = useState(false);
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState('form'); // 'form' | 'processing' | 'declined'

    const cardType = detectCardType(cardNumber);
    const displayNumber = cardNumber || '•••• •••• •••• ••••';
    const displayName = cardName || 'VOTRE NOM';
    const displayExpiry = expiry || 'MM/AA';

    const validate = () => {
        const errs = {};
        const rawNumber = cardNumber.replace(/\s/g, '');
        if (rawNumber.length < 16) errs.cardNumber = 'Numéro invalide (16 chiffres requis)';
        if (!cardName.trim()) errs.cardName = 'Nom requis';
        const parts = expiry.split('/');
        const expM = parseInt(parts[0], 10);
        const expY = parseInt('20' + (parts[1] || ''), 10);
        const now = new Date();
        if (!expiry || expiry.length < 5 || expM < 1 || expM > 12 ||
            expY < now.getFullYear() ||
            (expY === now.getFullYear() && expM < now.getMonth() + 1)) {
            errs.expiry = "Date d'expiration invalide";
        }
        if (cvv.length < 3) errs.cvv = 'CVV invalide';
        return errs;
    };

    const handlePay = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setStep('processing');

        await new Promise(r => setTimeout(r, 2200));

        const raw = cardNumber.replace(/\s/g, '');
        if (raw.startsWith('4000')) {
            setStep('declined');
        } else {
            setStep('form');
            onSuccess();
        }
    };

    if (step === 'processing') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-6"
            >
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-[#667eea]/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#667eea] animate-spin" />
                    <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                        <Lock size={20} className="text-white" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-display text-[18px] font-bold text-white">Traitement en cours...</p>
                    <p className="text-[13px] text-slate-400 mt-1">Connexion sécurisée au réseau bancaire</p>
                </div>
                <div className="flex gap-2 mt-2">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#667eea]"
                            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>
            </motion.div>
        );
    }

    if (step === 'declined') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 gap-4"
            >
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <AlertCircle size={32} className="text-red-400" />
                </div>
                <div className="text-center">
                    <p className="font-display text-[18px] font-bold text-red-400">Paiement refusé</p>
                    <p className="text-[13px] text-slate-400 mt-1">Votre carte a été refusée. Veuillez réessayer.</p>
                </div>
                <button
                    onClick={() => setStep('form')}
                    className="mt-2 px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-[14px] font-bold hover:opacity-90 transition-all"
                >
                    Réessayer
                </button>
                <p className="text-[11px] text-slate-500 text-center px-4">
                    Astuce: Utilisez n'importe quel numéro ne commençant pas par 4000 pour tester un paiement réussi.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* 3D Card Visual */}
            <div style={{ perspective: '1000px' }} className="w-full h-[170px]">
                <motion.div
                    style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                    {/* Front */}
                    <div
                        style={{
                            backfaceVisibility: 'hidden',
                            background: 'linear-gradient(135deg, #1a1f35 0%, #2d1b69 50%, #1a1035 100%)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                        }}
                        className="absolute inset-0 rounded-[20px] p-5 flex flex-col justify-between overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 rounded-[20px]"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="w-10 h-7 rounded-[4px] bg-gradient-to-br from-yellow-300 to-yellow-500" />
                            <CardLogo type={cardType} />
                        </div>
                        <div className="relative z-10">
                            <p className="font-mono text-[15px] text-white tracking-widest mb-3">{displayNumber}</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Titulaire</p>
                                    <p className="font-sans text-[12px] font-semibold text-white uppercase tracking-wider truncate max-w-[160px]">{displayName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Expire</p>
                                    <p className="font-sans text-[12px] font-semibold text-white">{displayExpiry}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background: 'linear-gradient(135deg, #1a1f35 0%, #2d1b69 50%, #1a1035 100%)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        }}
                        className="absolute inset-0 rounded-[20px] overflow-hidden flex flex-col justify-center"
                    >
                        <div className="w-full h-9 bg-[#0a0d1a] mt-4" />
                        <div className="px-5 mt-4">
                            <div className="h-9 bg-white/10 rounded-[6px] flex items-center justify-end px-3">
                                <p className="font-mono text-[14px] text-slate-300 tracking-widest">{cvv || '•••'}</p>
                            </div>
                            <p className="text-[9px] text-white/30 mt-2 text-right">CVV / CVC</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-3">
                <div>
                    <div className={`bg-[#1a2133] rounded-[12px] px-4 py-3 flex items-center gap-3 border transition-all ${errors.cardNumber ? 'border-red-500/50' : 'border-transparent focus-within:border-[#667eea]/60'}`}>
                        <CreditCard size={16} className="text-slate-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={e => { setCardNumber(formatCardNumber(e.target.value)); setErrors(p => ({ ...p, cardNumber: null })); }}
                            maxLength={19}
                            className="bg-transparent flex-1 text-white font-mono text-[14px] tracking-wider focus:outline-none placeholder:text-slate-600"
                        />
                        {cardType !== 'unknown' && <div className="shrink-0"><CardLogo type={cardType} /></div>}
                    </div>
                    {errors.cardNumber && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.cardNumber}</p>}
                </div>

                <div>
                    <div className={`bg-[#1a2133] rounded-[12px] px-4 py-3 border transition-all ${errors.cardName ? 'border-red-500/50' : 'border-transparent focus-within:border-[#667eea]/60'}`}>
                        <input
                            type="text"
                            placeholder="Nom sur la carte"
                            value={cardName}
                            onChange={e => { setCardName(e.target.value.toUpperCase()); setErrors(p => ({ ...p, cardName: null })); }}
                            className="bg-transparent w-full text-white text-[14px] focus:outline-none placeholder:text-slate-600 uppercase"
                        />
                    </div>
                    {errors.cardName && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.cardName}</p>}
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className={`bg-[#1a2133] rounded-[12px] px-4 py-3 border transition-all ${errors.expiry ? 'border-red-500/50' : 'border-transparent focus-within:border-[#667eea]/60'}`}>
                            <input
                                type="text"
                                placeholder="MM/AA"
                                value={expiry}
                                onChange={e => { setExpiry(formatExpiry(e.target.value)); setErrors(p => ({ ...p, expiry: null })); }}
                                maxLength={5}
                                className="bg-transparent w-full text-white font-mono text-[14px] focus:outline-none placeholder:text-slate-600"
                            />
                        </div>
                        {errors.expiry && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.expiry}</p>}
                    </div>
                    <div className="w-28 shrink-0">
                        <div className={`bg-[#1a2133] rounded-[12px] px-4 py-3 border transition-all ${errors.cvv ? 'border-red-500/50' : 'border-transparent focus-within:border-[#667eea]/60'}`}>
                            <input
                                type="password"
                                placeholder="CVV"
                                value={cvv}
                                maxLength={4}
                                onChange={e => { setCvv(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, cvv: null })); }}
                                onFocus={() => setFlipped(true)}
                                onBlur={() => setFlipped(false)}
                                className="bg-transparent w-full text-white font-mono text-[14px] focus:outline-none placeholder:text-slate-600"
                            />
                        </div>
                        {errors.cvv && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.cvv}</p>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
                <Lock size={12} />
                <p className="text-[11px]">Paiement chiffré 256-bit SSL. Vos données sont protégées.</p>
            </div>

            <button
                type="button"
                onClick={handlePay}
                className="w-full py-4 rounded-[14px] bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-[15px] font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Lock size={16} />
                Payer maintenant
            </button>
        </div>
    );
};

export default PaymentCardForm;
