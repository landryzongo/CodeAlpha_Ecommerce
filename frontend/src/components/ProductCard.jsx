import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import API_BASE_URL from '../config/api';

const getImageUrl = (image) => {
    if (!image) return '/placeholder.png';
    if (image.startsWith('/uploads/')) {
        return `${API_BASE_URL.replace(/\/api$/, '')}${image}`;
    }
    return image;
};

const ProductCard = ({ product, index, onAddToCart }) => {
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
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart(product, e);
                            }}
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

export default ProductCard;
