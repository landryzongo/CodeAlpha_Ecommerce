import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, ShoppingBag, Grid, Tag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';
import ProductCard from '../../components/ProductCard';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const { products, loading, categories } = useProducts();
    const { addToCart } = useCart();
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        const category = params.get('category');

        if (search) {
            setSearchQuery(search.toLowerCase());
        } else {
            setSearchQuery('');
        }

        if (category) {
            setActiveCategory(category === 'all' ? 'Tous' : category);
        } else {
            setActiveCategory('Tous');
        }
    }, [location.search]);

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        navigate(cat === 'Tous' ? '/' : `/?category=${encodeURIComponent(cat)}`);
    };

    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            if (activeCategory !== 'Tous' && product.category !== activeCategory) return false;
            if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && !product.description?.toLowerCase().includes(searchQuery)) return false;
            return true;
        });
    }, [products, activeCategory, searchQuery]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-sans">{t('home.loading')}</p>
        </div>
    );

    // Animation variants
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

    return (
        <main className="flex-grow px-[16px] md:px-[40px] py-[24px] pb-32 md:pb-[40px] flex flex-col gap-[32px]">
            
            {/* Top Categories Bar (Horizontal) */}
            <div className="hidden md:flex items-center justify-between border-b border-white/10 pb-[4px] overflow-x-auto overflow-y-hidden scrollbar-hide">
                <div className="flex items-center gap-[32px]">
                    <motion.button 
                        onClick={() => handleCategoryClick('Tous')}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`flex items-center gap-2 font-sans text-[14px] font-bold whitespace-nowrap transition-colors relative pb-[12px] -mb-[5px] ${activeCategory === 'Tous' ? 'text-white border-b-2 border-[#667eea]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Grid size={16} /> {t('home.all_gadgets')}
                    </motion.button>
                    {categories.filter(c => c !== 'Tous').map(cat => (
                        <motion.button 
                            key={cat} 
                            onClick={() => handleCategoryClick(cat)}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className={`flex items-center gap-2 font-sans text-[14px] font-bold whitespace-nowrap transition-colors relative pb-[12px] -mb-[5px] ${activeCategory === cat ? 'text-white border-b-2 border-[#667eea]' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Tag size={16} /> {t(`categories.${cat}`)}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
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

            {/* Main Content Layout (Full Width) */}
            <div id="catalog" className="flex flex-col gap-[24px] scroll-mt-24">
                
                {/* Product Grid Area */}
                <div className="flex flex-col gap-[24px] w-full">
                    
                    {/* Mobile Category Chips */}
                    <div className="md:hidden flex overflow-x-auto overflow-y-hidden gap-[12px] pb-[12px] snap-x scrollbar-hide">
                        <button 
                            onClick={() => handleCategoryClick('Tous')}
                            className={`whitespace-nowrap px-[20px] py-[8px] rounded-full font-sans text-[14px] font-semibold snap-start transition-colors ${activeCategory === 'Tous' ? 'bg-[#2e3152] text-white' : 'glass-card text-slate-400'}`}
                        >
                            {t('home.all_gadgets')}
                        </button>
                        {categories.filter(c => c !== 'Tous').map(cat => (
                            <button 
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`whitespace-nowrap px-[20px] py-[8px] rounded-full font-sans text-[14px] font-semibold snap-start transition-colors ${activeCategory === cat ? 'bg-[#2e3152] text-white' : 'glass-card text-slate-400'}`}
                            >
                                {t(`categories.${cat}`)}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mb-[8px]">
                        <h2 className="font-display text-[24px] md:text-[28px] font-bold text-white">
                            {searchQuery ? `${t('home.results_for')} "${searchQuery}"` : (activeCategory === 'Tous' ? t('home.trending') : t(`categories.${activeCategory}`))}
                        </h2>
                        <a href="#catalog" className="text-[#a2a8d3] font-sans text-[14px] font-semibold flex items-center gap-1 hover:text-white transition-colors">
                            {t('home.view_all')} <ArrowRight size={14} />
                        </a>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="glass-card rounded-[24px] p-12 text-center flex flex-col items-center justify-center">
                            <ShoppingBag size={48} className="text-slate-500 mb-4" />
                            <h3 className="text-xl text-white font-display font-semibold mb-2">{t('home.no_products')}</h3>
                            <p className="text-slate-400 font-sans">{t('home.no_products_sub')}</p>
                            <button onClick={() => handleCategoryClick('Tous')} className="mt-6 text-[#b5a6f2] hover:underline">{t('home.clear_filters')}</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] md:gap-[24px]">
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard 
                                        key={product._id || product.id} 
                                        product={product} 
                                        index={index}
                                        onAddToCart={(product, e) => {
                                            const stock = Number(product.stock) || 0;
                                            if (stock === 0) {
                                                toast.error(t('toast.out_of_stock'));
                                                return;
                                            }
                                            addToCart(product);
                                            toast.success(
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-[14px]">{t('toast.added_to_cart')}</span>
                                                    <span className="text-[12px] opacity-80">{product.name}</span>
                                                </div>
                                            );
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Home;
