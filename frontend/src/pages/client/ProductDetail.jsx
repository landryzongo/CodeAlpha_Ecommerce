import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Share2, ArrowLeft, Star, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import API_BASE_URL from '../../config/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { products, loading: productsLoading } = useProducts();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!productsLoading) {
            const foundProduct = products.find(p => p._id === id || p.id === id);
            setProduct(foundProduct);
            setLoading(false);
        }
        window.scrollTo(0, 0);
    }, [id, products, productsLoading]);

    const handleAddToCart = () => {
        if (product && quantity > 0) {
            addToCart(product, quantity);
        }
    };

    const getImageUrl = (image) => {
        if (!image) return 'https://via.placeholder.com/400';
        if (image.startsWith('/uploads/')) {
            return `${API_BASE_URL.replace(/\/api$/, '')}${image}`;
        }
        return image;
    };

    if (loading || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const stock = Number(product.stock) || 0;
    const isOutOfStock = stock === 0;
    const relatedProducts = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col">

            {/* Subtle background glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#667eea] rounded-full blur-[150px] opacity-[0.06]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#764ba2] rounded-full blur-[150px] opacity-[0.06]"></div>
            </div>

            {/* Simple Navbar (Logo Only) */}
            <header className="relative z-20 w-full px-[16px] md:px-[40px] py-[20px] flex items-center bg-[#020617]/90 backdrop-blur-[24px] border-b border-white/5 sticky top-0">
                <Link to="/" className="flex flex-col justify-center group shrink-0 w-auto leading-none">
                    <img src="/logo.png" alt="NovaTech" className="w-[120px] md:w-[150px] h-auto object-contain group-hover:scale-105 transition-transform origin-left" />
                    <span className="font-sans text-[9px] text-slate-400 font-semibold tracking-wide hidden md:block pl-1 mt-[2px]">
                        Discover. Shop. Upgrade.
                    </span>
                </Link>
            </header>

            <main className="relative z-10 flex-grow px-[16px] md:px-[40px] py-[32px] md:py-[40px] max-w-[1120px] mx-auto w-full flex flex-col pb-[120px]">
            <div className="flex items-center justify-between mb-[24px]">
                <div className="flex items-center gap-[12px]">
                    <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full glass-card text-[#667eea] hover:bg-white/10 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <span className="font-sans text-[13px] text-slate-400">Back to products</span>
                </div>
                {/* Touche partage supprimée selon la demande */}
            </div>

            <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[48px] items-start">
                
                {/* Left: Product Image */}
                <div className="w-full lg:w-[45%] flex flex-col gap-[24px]">
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[24px] glass-card flex items-center justify-center p-[24px] group overflow-hidden">
                        <motion.div 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full relative z-0 flex items-center justify-center"
                        >
                            <img 
                                src={getImageUrl(product.image)} 
                                alt={product.name} 
                                className={`max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
                            />
                        </motion.div>
                        <button 
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="absolute top-[16px] right-[16px] w-10 h-10 flex items-center justify-center rounded-full glass-card text-white z-10 hover:bg-white/10 transition-colors"
                        >
                            <Heart size={20} className={isFavorite ? 'fill-[#ef4444] text-[#ef4444]' : 'hover:text-[#ef4444] transition-colors'} />
                        </button>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="w-full lg:w-[55%] flex flex-col gap-[20px]">
                    
                    <div className="flex flex-col gap-[12px]">
                        <h1 className="font-display text-[26px] md:text-[34px] font-bold text-white leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-[12px]">
                            <span className="font-display text-[24px] md:text-[28px] font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                ${product.price.toLocaleString()}
                            </span>
                            <div className={`flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 ${isOutOfStock ? 'bg-[#ef4444]/10 border-[#ef4444]/20' : ''}`}>
                                <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor] ${isOutOfStock ? 'bg-[#ef4444] text-[#ef4444]' : 'bg-[#22c55e] text-[#22c55e]'}`}></span>
                                <span className={`font-sans text-[11px] font-semibold ${isOutOfStock ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                                    {isOutOfStock ? 'Out of stock' : 'In stock'}
                                </span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-[6px]">
                            <div className="flex text-[#fbbf24]">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" opacity={0.5} />
                            </div>
                            <span className="font-sans text-[13px] text-slate-400 font-semibold">(128 reviews)</span>
                        </div>
                    </div>

                    <div className="h-[1px] bg-white/10 w-full my-[4px]"></div>

                    {/* Description */}
                    <div className="flex flex-col gap-[8px]">
                        <h3 className="font-sans text-[15px] font-bold text-white">Description</h3>
                        <p className="font-sans text-[14px] text-slate-400 leading-relaxed">
                            {product.description || "Premium quality product engineered for performance and comfort. Perfect for your daily setup."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-[20px] mt-[12px]">
                        
                        {!isOutOfStock && (
                            <div className="flex items-center gap-[12px]">
                                <span className="font-sans text-[14px] font-bold text-white">Quantity</span>
                                <div className="glass-card rounded-full flex items-center p-1 border border-white/10">
                                    <button 
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-sans text-[15px] font-semibold text-white w-10 text-center">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`w-full py-[14px] rounded-[16px] font-sans text-[15px] font-bold transition-all flex items-center justify-center gap-[10px] ${isOutOfStock ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-[0_8px_20px_rgba(102,126,234,0.25)] hover:shadow-[0_12px_25px_rgba(102,126,234,0.4)] active:scale-95 relative overflow-hidden group'}`}
                        >
                            {!isOutOfStock && (
                                <div className="absolute inset-0 bg-white/20 -skew-x-[25deg] -translate-x-[150%] group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                            )}
                            <ShoppingBag size={20} />
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>

                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-[80px] flex flex-col gap-[24px]">
                    <h3 className="font-display text-[24px] font-bold text-white">You might also like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
                        {relatedProducts.map(related => (
                            <Link key={related._id || related.id} to={`/product/${related._id || related.id}`} className="flex flex-col gap-[12px] group">
                                <div className="w-full aspect-square rounded-[24px] glass-card flex items-center justify-center p-[20px] border border-white/10 overflow-hidden">
                                    <img src={getImageUrl(related.image)} alt={related.name} className="w-[80%] h-[80%] object-contain group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col px-2">
                                    <span className="font-sans text-[14px] font-semibold text-slate-400 line-clamp-1">{related.name}</span>
                                    <span className="font-sans text-[18px] font-bold text-white">${related.price.toLocaleString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </main>
        </div>
    );
};

export default ProductDetail;
