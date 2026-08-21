import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { getAuthenticatedAxios } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            await api.post('/categories', { name: name.trim() });
            toast.success('Catégorie ajoutée avec succès !');
            navigate('/admin/products');
        } catch (err) {
            console.error('Erreur:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-bold"
            >
                <ChevronLeft size={20} />
                Retour aux produits
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden"
            >
                <div className="bg-indigo-600 p-8 text-white">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <Tag size={32} />
                        </div>
                        <h1 className="text-3xl font-black">Nouvelle Catégorie</h1>
                    </div>
                    <p className="text-indigo-100 font-medium">Créez un nouvel onglet pour organiser vos produits.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                            Nom de la catégorie
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Électronique, Vêtements, Accessoires..."
                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all text-lg"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="w-full py-5 bg-indigo-600 hover:bg-black text-white font-black rounded-3xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={24} />
                                    ENREGISTRER LA CATÉGORIE
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddCategory;
