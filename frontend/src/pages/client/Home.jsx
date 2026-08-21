import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, ShoppingBag, Grid, Tag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const Home = () => {
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

    const getImageUrl = (image) => {
        if (!image) return 'https://via.placeholder.com/400';
        if (image.startsWith('/uploads/')) {
            return `${API_BASE_URL.replace(/\/api$/, '')}${image}`;
        }
        return image;
    };

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        const stock = Number(product.stock) || 0;
        
        if (stock === 0) {
            toast.error('Rupture de stock');
            return;
        }

        addToCart(product);
        toast.success(
            <div className="flex flex-col gap-1">
                <span className="font-bold text-[14px]">Ajouté au panier</span>
                <span className="text-[12px] opacity-80">{product.name}</span>
            </div>
        );
    };

    const filteredProducts = products.filter(product => {
        if (activeCategory !== 'Tous' && product.category !== activeCategory) return false;
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && !product.description?.toLowerCase().includes(searchQuery)) return false;
        return true;
    });

    const ProductCard = ({ product, index }) => {
        const stock = Number(product.stock) || 0;
        const isOutOfStock = stock === 0;

        return (
            <Link to={`/product/${product._id || product.id}`}>
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#0b0d17] border border-[#1e2030] rounded-[20px] p-[12px] flex flex-col gap-[12px] relative group hover:-translate-y-1 transition-transform duration-300 shadow-lg"
                >
                    <div className="w-full aspect-square rounded-[16px] bg-[#1a1c29] relative overflow-hidden">
                        <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name} 
                            className={`w-full h-full object-cover transition-all duration-500 ${isOutOfStock ? 'grayscale opacity-50' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`} 
                        />
                        
                        {!isOutOfStock && (
                            <button 
                                onClick={(e) => handleAddToCart(product, e)}
                                className="absolute top-[12px] right-[12px] w-8 h-8 rounded-full bg-[#b5a6f2] flex items-center justify-center text-[#1a1d2d] shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                            >
                                <Plus size={16} className="stroke-[3px]" />
                            </button>
                        )}
                        
                        <span className="absolute top-[12px] left-[12px] px-[12px] py-[4px] rounded-full bg-[#020617]/60 backdrop-blur-md text-white font-sans text-[10px] font-semibold border border-white/10">
                            {isOutOfStock ? 'Out of Stock' : 'New Arrival'}
                        </span>
                    </div>
                    
                    <div className="flex flex-col gap-[4px] px-[4px] pb-[4px]">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-display text-[16px] font-bold text-white line-clamp-1">{product.name}</h3>
                            <span className="font-display text-[16px] font-bold text-white shrink-0">${product.price.toLocaleString()}</span>
                        </div>
                        <p className="font-sans text-[12px] text-slate-400 line-clamp-1">{product.description || product.category}</p>
                    </div>
                </motion.article>
            </Link>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-sans">Loading catalog...</p>
        </div>
    );

    return (
        <main className="flex-grow px-[16px] md:px-[40px] py-[24px] pb-32 md:pb-[40px] flex flex-col gap-[32px]">
            
            {/* Top Categories Bar (Horizontal) */}
            <div className="hidden md:flex items-center justify-between border-b border-white/10 pb-[4px] overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-[32px]">
                    <button 
                        onClick={() => handleCategoryClick('Tous')} 
                        className={`flex items-center gap-2 font-sans text-[14px] font-bold whitespace-nowrap transition-colors relative pb-[12px] -mb-[5px] ${activeCategory === 'Tous' ? 'text-white border-b-2 border-[#667eea]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Grid size={16} /> All Gadgets
                    </button>
                    {categories.filter(c => c !== 'Tous').map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => handleCategoryClick(cat)} 
                            className={`flex items-center gap-2 font-sans text-[14px] font-bold whitespace-nowrap transition-colors relative pb-[12px] -mb-[5px] ${activeCategory === cat ? 'text-white border-b-2 border-[#667eea]' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Tag size={16} /> {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <section className="w-full rounded-[24px] p-[40px] md:p-[64px] flex flex-col items-center justify-center text-center gap-[24px] relative overflow-hidden bg-gradient-to-br from-[#4b4e78] via-[#3a3b5c] to-[#25233c] shadow-[0_10px_40px_rgba(0,0,0,0.5)] mt-2">
                
                <span className="px-[20px] py-[6px] rounded-full bg-white/10 border border-white/20 text-[#c7ccf8] font-sans text-[12px] font-bold uppercase tracking-widest backdrop-blur-md">
                    Exclusive Offer
                </span>
                
                <h1 className="font-display text-[32px] md:text-[56px] font-bold text-white leading-tight relative z-10 max-w-3xl">
                    Latest Tech<br/>
                    <span className="text-[#d8a8ff]">Gadgets</span>
                </h1>
                
                <p className="font-sans text-[14px] md:text-[16px] text-slate-300 max-w-2xl relative z-10">
                    Explore cutting-edge gadgets that upgrade your lifestyle.<br/>
                    Unlock your potential today.
                </p>
                
                <button 
                    onClick={() => {
                        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-[16px] px-[40px] py-[12px] rounded-full bg-[#b5a6f2] text-[#1a1d2d] font-sans text-[14px] font-bold hover:shadow-[0_0_20px_rgba(181,166,242,0.4)] active:scale-95 transition-all relative z-10 flex items-center gap-2"
                >
                    Shop Now <ArrowRight size={16} />
                </button>
            </section>

            {/* Main Content Layout (Full Width) */}
            <div id="catalog" className="flex flex-col gap-[24px] scroll-mt-24">
                
                {/* Product Grid Area */}
                <div className="flex flex-col gap-[24px] w-full">
                    
                    {/* Mobile Category Chips */}
                    <div className="md:hidden flex overflow-x-auto gap-[12px] pb-[12px] snap-x scrollbar-hide">
                        <button 
                            onClick={() => handleCategoryClick('Tous')}
                            className={`whitespace-nowrap px-[20px] py-[8px] rounded-full font-sans text-[14px] font-semibold snap-start transition-colors ${activeCategory === 'Tous' ? 'bg-[#2e3152] text-white' : 'glass-card text-slate-400'}`}
                        >
                            All
                        </button>
                        {categories.filter(c => c !== 'Tous').map(cat => (
                            <button 
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`whitespace-nowrap px-[20px] py-[8px] rounded-full font-sans text-[14px] font-semibold snap-start transition-colors ${activeCategory === cat ? 'bg-[#2e3152] text-white' : 'glass-card text-slate-400'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mb-[8px]">
                        <h2 className="font-display text-[24px] md:text-[28px] font-bold text-white">
                            {searchQuery ? `Results for "${searchQuery}"` : (activeCategory === 'Tous' ? 'Trending Audio' : activeCategory)}
                        </h2>
                        <a href="#catalog" className="text-[#a2a8d3] font-sans text-[14px] font-semibold flex items-center gap-1 hover:text-white transition-colors">
                            View All <ArrowRight size={14} />
                        </a>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="glass-card rounded-[24px] p-12 text-center flex flex-col items-center justify-center">
                            <ShoppingBag size={48} className="text-slate-500 mb-4" />
                            <h3 className="text-xl text-white font-display font-semibold mb-2">No products found</h3>
                            <p className="text-slate-400 font-sans">Try selecting a different category or adjusting your search.</p>
                            <button onClick={() => handleCategoryClick('Tous')} className="mt-6 text-[#b5a6f2] hover:underline">Clear filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] md:gap-[24px]">
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard key={product._id || product.id} product={product} index={index} />
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
