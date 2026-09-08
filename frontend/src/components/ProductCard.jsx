import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getImageUrl = (image) => {
    if (!image) return '/placeholder.png';
    if (image.startsWith('http')) return image;
    return image;
};

const ProductCard = ({ product, index, onAddToCart }) => {
    const { t } = useTranslation();
    const stock = Number(product.stock) || 0;
    const isOutOfStock = stock === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (index % 8) * 0.07, ease: 'easeOut' }}
        >
            <Link to={`/product/${product._id || product.id}`}>
                <motion.article
                    className="bg-[#0b0d17] border border-[#1e2030] rounded-[20px] p-[12px] flex flex-col gap-[12px] relative group shadow-lg cursor-pointer"
                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                    <div className="w-full aspect-square rounded-[16px] bg-[#1a1c29] relative overflow-hidden">
                        <motion.img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isOutOfStock ? 'grayscale opacity-50' : 'opacity-90 group-hover:opacity-100'}`}
                            whileHover={{ scale: isOutOfStock ? 1 : 1.06 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        />

                        {!isOutOfStock && (
                            <motion.button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAddToCart(product, e);
                                }}
                                className="absolute top-[12px] right-[12px] w-8 h-8 rounded-full bg-[#b5a6f2] flex items-center justify-center text-[#1a1d2d] shadow-lg z-10"
                                whileHover={{ scale: 1.15, backgroundColor: '#c8bcff' }}
                                whileTap={{ scale: 0.88 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                            >
                                <Plus size={16} className="stroke-[3px]" />
                            </motion.button>
                        )}

                        <span className="absolute top-[12px] left-[12px] px-[12px] py-[4px] rounded-full bg-[#020617]/60 backdrop-blur-md text-white font-sans text-[10px] font-semibold border border-white/10">
                            {isOutOfStock ? t('home.out_of_stock') : t('home.new_arrival')}
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
        </motion.div>
    );
};

export default ProductCard;
