import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const heroContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const heroItem = {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } }
};

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section className="w-full rounded-[24px] p-[40px] md:p-[64px] flex flex-col items-center justify-center text-center gap-[24px] relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] mt-2" style={{ background: 'linear-gradient(135deg, #4b4e78, #3a3b5c, #25233c)' }}>
            
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #667eea, transparent)', top: '-20%', left: '-10%' }}
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #764ba2, transparent)', bottom: '-20%', right: '-10%' }}
                    animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/30"
                        style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                        animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                    />
                ))}
            </div>

            <motion.div
                variants={heroContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center gap-[24px] relative z-10"
            >
                <motion.span variants={heroItem} className="px-[20px] py-[6px] rounded-full bg-white/10 border border-white/20 text-[#c7ccf8] font-sans text-[12px] font-bold uppercase tracking-widest backdrop-blur-md">
                    {t('home.exclusive_offer')}
                </motion.span>
                
                <motion.h1 variants={heroItem} className="font-display text-[32px] md:text-[56px] font-bold text-white leading-tight max-w-3xl">
                    {t('home.hero_title_1')}<br/>
                    <motion.span
                        className="inline-block"
                        style={{
                            background: 'linear-gradient(90deg, #d8a8ff, #b5a6f2, #d8a8ff)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                        animate={{ backgroundPosition: ['0% center', '200% center'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                        {t('home.hero_title_2')}
                    </motion.span>
                </motion.h1>
                
                <motion.p variants={heroItem} className="font-sans text-[14px] md:text-[16px] text-slate-300 max-w-2xl whitespace-pre-line">
                    {t('home.hero_subtitle')}
                </motion.p>
                
                <motion.div variants={heroItem}>
                    <motion.button 
                        onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                        className="mt-[16px] px-[40px] py-[12px] rounded-full bg-[#b5a6f2] text-[#1a1d2d] font-sans text-[14px] font-bold relative flex items-center gap-2 overflow-hidden"
                        whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(181,166,242,0.5)' }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                    >
                        {t('home.shop_now')}
                        <motion.span
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            <ArrowRight size={16} />
                        </motion.span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
