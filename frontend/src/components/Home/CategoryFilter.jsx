import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Renders the category filter chips for both desktop and mobile views.
 * 
 * @param {Object} props
 * @param {string[]} props.categories - List of category names
 * @param {string} props.activeCategory - Currently selected category
 * @param {function} props.onCategoryClick - Callback when a category is clicked
 * @param {boolean} [props.isMobile=false] - If true, renders the mobile layout
 */
const CategoryFilter = ({ categories, activeCategory, onCategoryClick, isMobile = false }) => {
    const { t } = useTranslation();

    if (isMobile) {
        return (
            <div className="md:hidden flex overflow-x-auto overflow-y-hidden gap-[12px] pb-[12px] snap-x scrollbar-hide">
                <button 
                    onClick={() => onCategoryClick('Tous')}
                    className={`whitespace-nowrap px-[20px] py-[8px] rounded-full font-sans text-[14px] font-semibold snap-start transition-colors ${activeCategory === 'Tous' ? 'bg-[#2e3152] text-white' : 'glass-card text-slate-400'}`}
                >
                    {t('home.all_gadgets')}
                </button>
                {categories.filter(c => c !== 'Tous').map(cat => (
                    <button 
                        key={cat}
                        onClick={() => onCategoryClick(cat)}
                        className={`whitespace-nowrap px-[20px] py-[8px] rounded-full font-sans text-[14px] font-semibold snap-start transition-colors ${activeCategory === cat ? 'bg-[#2e3152] text-white' : 'glass-card text-slate-400'}`}
                    >
                        {t(`categories.${cat}`)}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="hidden md:flex items-center justify-between border-b border-white/10 pb-[4px] overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex items-center gap-[32px]">
                <motion.button 
                    onClick={() => onCategoryClick('Tous')}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`flex items-center gap-2 font-sans text-[14px] font-bold whitespace-nowrap transition-colors relative pb-[12px] -mb-[5px] ${activeCategory === 'Tous' ? 'text-white border-b-2 border-[#667eea]' : 'text-slate-400 hover:text-white'}`}
                >
                    <Grid size={16} /> {t('home.all_gadgets')}
                </motion.button>
                {categories.filter(c => c !== 'Tous').map(cat => (
                    <motion.button 
                        key={cat} 
                        onClick={() => onCategoryClick(cat)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`flex items-center gap-2 font-sans text-[14px] font-bold whitespace-nowrap transition-colors relative pb-[12px] -mb-[5px] ${activeCategory === cat ? 'text-white border-b-2 border-[#667eea]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Tag size={16} /> {t(`categories.${cat}`)}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
