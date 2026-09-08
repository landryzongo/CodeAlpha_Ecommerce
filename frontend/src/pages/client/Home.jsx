import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, ShoppingBag, Grid, Tag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';
import ProductCard from '../../components/ProductCard';
import HeroSection from '../../components/Home/HeroSection';
import CategoryFilter from '../../components/Home/CategoryFilter';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const { products, loading, categories } = useProducts();
    const { addToCart } = useCart();
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
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

        if (params.get('sort')) {
            setSortBy(params.get('sort'));
        } else {
            setSortBy('');
        }
    }, [location.search]);

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        navigate(cat === 'Tous' ? '/' : `/?category=${encodeURIComponent(cat)}`);
    };

    const filteredProducts = React.useMemo(() => {
        let result = products.filter(product => {
            if (activeCategory !== 'Tous' && product.category !== activeCategory) return false;
            if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && !product.description?.toLowerCase().includes(searchQuery)) return false;
            return true;
        });

        if (sortBy === 'newest') {
            // Assuming products have _id (MongoDB ObjectId contains timestamp) or createdAt
            result.sort((a, b) => {
                if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
                if (a._id && b._id) return b._id.localeCompare(a._id);
                return 0;
            });
        }

        return result;
    }, [products, activeCategory, searchQuery, sortBy]);

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
            
            <CategoryFilter 
                categories={categories} 
                activeCategory={activeCategory} 
                onCategoryClick={handleCategoryClick} 
                isMobile={false} 
            />

            <HeroSection />

            {/* Main Content Layout (Full Width) */}
            <div id="catalog" className="flex flex-col gap-[24px] scroll-mt-24">
                
                {/* Product Grid Area */}
                <div className="flex flex-col gap-[24px] w-full">
                    
                    <CategoryFilter 
                        categories={categories} 
                        activeCategory={activeCategory} 
                        onCategoryClick={handleCategoryClick} 
                        isMobile={true} 
                    />

                    <div className="flex justify-between items-center mb-[8px]">
                        <h2 className="font-display text-[24px] md:text-[28px] font-bold text-white">
                            {searchQuery ? `${t('home.results_for')} "${searchQuery}"` : (activeCategory === 'Tous' ? t('home.trending') : t(`categories.${activeCategory}`))}
                        </h2>
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
