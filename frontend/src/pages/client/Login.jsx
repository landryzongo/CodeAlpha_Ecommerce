import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Hexagon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false); // Pour le lift de la carte

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Calcul de la robustesse du mot de passe
    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '' };
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const levels = [
            { score: 0, label: '', color: '' },
            { score: 1, label: t('auth.strength_weak1'), color: '#ef4444' },
            { score: 2, label: t('auth.strength_weak2'), color: '#f97316' },
            { score: 3, label: t('auth.strength_medium'), color: '#eab308' },
            { score: 4, label: t('auth.strength_strong'), color: '#22c55e' },
            { score: 5, label: t('auth.strength_very_strong'), color: '#667eea' },
        ];
        return levels[score] || levels[levels.length - 1];
    };

    const strength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let success = false;
        if (isLogin) {
            success = await login(formData.email, formData.password);
        } else {
            // Adapté si besoin de plus de champs d'inscription
            success = await register(formData, navigate);
        }

        if (success && isLogin) {
            navigate(from, { replace: true });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
            {/* Background Radial Gradient */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-[#1e1b4b] rounded-full blur-[120px] opacity-60"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                    opacity: 1, 
                    y: isFocused ? -6 : 0 // Lift au focus
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-[90%] lg:w-[32%] max-w-[460px] z-10"
            >
                {/* 
                  Card Glassmorphism
                  Verre sombre : rgba(15, 23, 42, 0.7) + bordure 1px rgba(255,255,255, 0.1) + backdrop-blur(24px).
                  Ombre : X:0, Y:16, Blur:40, Spread:-4, Opacité: 15% (couleur #667eea).
                */}
                <div 
                    className="px-[32px] pt-[32px] pb-[32px] rounded-[24px] flex flex-col gap-[12px] relative"
                    style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0px 16px 40px -4px rgba(102, 126, 234, 0.15)'
                    }}
                >
                    {/* Header Logo + Title group */}
                    <div className="flex flex-col items-center gap-6">
                        <img src="/logo.png" alt="NovaTech" className="w-[160px] md:w-[200px] h-auto object-contain" />
                        <div className="text-center">
                            <h2 className="text-[28px] font-semibold font-display text-white mb-1 leading-tight">
                                {isLogin ? t('auth.login_title') : t('auth.register_title')}
                            </h2>
                            <p className="text-[#94a3b8] text-[14px] font-normal">
                                {isLogin
                                    ? t('auth.login_subtitle')
                                    : t('auth.register_subtitle')}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-normal text-slate-300">{t('auth.name')}</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#764ba2] transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        className="w-full h-[52px] pl-12 pr-4 rounded-[12px] bg-transparent border border-white/10 text-white placeholder-slate-500 outline-none focus:border-transparent focus:ring-2 focus:ring-[#764ba2] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-normal text-slate-300">{t('auth.email')}</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#764ba2] transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="w-full h-[52px] pl-12 pr-4 rounded-[12px] bg-transparent border border-white/10 text-white placeholder-slate-500 outline-none focus:border-transparent focus:ring-2 focus:ring-[#764ba2] transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[14px] font-normal text-slate-300">{t('auth.password')}</label>
                                {isLogin && (
                                    <a href="#" className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors">
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#764ba2] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="w-full h-[52px] pl-12 pr-12 rounded-[12px] bg-transparent border border-white/10 text-white placeholder-slate-500 outline-none focus:border-transparent focus:ring-2 focus:ring-[#764ba2] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Barre de robustesse — uniquement en mode Register */}
                            {!isLogin && formData.password && (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <motion.div
                                                key={level}
                                                className="h-1 flex-1 rounded-full"
                                                initial={{ scaleX: 0 }}
                                                animate={{
                                                    scaleX: strength.score >= level ? 1 : 0,
                                                    backgroundColor: strength.score >= level ? strength.color : 'rgba(255,255,255,0.1)'
                                                }}
                                                style={{
                                                    backgroundColor: strength.score >= level ? strength.color : 'rgba(255,255,255,0.1)',
                                                    transformOrigin: 'left'
                                                }}
                                                transition={{ duration: 0.3, delay: level * 0.05 }}
                                            />
                                        ))}
                                    </div>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[11px] font-medium text-right"
                                        style={{ color: strength.color }}
                                    >
                                        {strength.label}
                                    </motion.p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="relative overflow-hidden w-full h-[56px] mt-2 rounded-[16px] text-white font-semibold text-[16px] flex items-center justify-center gap-2 group transition-all"
                            style={{
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                            }}
                        >
                            {/* Shine Effect Pseudo-element */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"></div>
                            
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? t('auth.login_btn') : t('auth.register_btn'))}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-2">
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                        <span className="text-[12px] text-slate-500 uppercase tracking-widest">or</span>
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                    </div>

                    <div className="text-center text-[14px]">
                        <span className="text-slate-400">
                            {isLogin ? `${t('auth.no_account')} ` : `${t('auth.has_account')} `}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-semibold"
                            style={{
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            {isLogin ? t('auth.sign_up') : t('auth.sign_in')}
                        </button>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default Login;
