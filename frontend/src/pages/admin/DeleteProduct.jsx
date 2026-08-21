import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Trash2, AlertTriangle, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const DeleteProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const { getAuthenticatedAxios } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error('Erreur:', err);
            toast.error('Produit introuvable');
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            await api.delete(`/products/${id}`);
            toast.success('Produit supprimé défiitivement');
            navigate('/admin/products');
        } catch (err) {
            console.error('Erreur:', err);
            toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-xl mx-auto py-8">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-bold"
            >
                <ChevronLeft size={20} />
                Annuler et retourner
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden"
            >
                <div className="bg-rose-500 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <Trash2 size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="text-3xl font-black italic">AVERTISSEMENT</h1>
                    </div>
                </div>

                <div className="p-8 space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl mb-2">
                            {product?.image ? (
                                <img
                                    src={product.image?.startsWith('/uploads/')
                                        ? `${API_BASE_URL.replace(/\/api$/, '')}${product.image}`
                                        : product.image}
                                    className="w-16 h-16 object-cover rounded-2xl shadow-sm"
                                    alt="Product"
                                />
                            ) : (
                                <Package size={40} />
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">
                            Voulez-vous vraiment supprimer <span className="text-rose-600">"{product?.name}"</span> ?
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Cette action est irréversible. Toutes les données liées à ce produit seront définitivement effacées de la base de données.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-3xl transition-all active:scale-95"
                        >
                            NON, ANNULER
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="w-full py-5 bg-rose-600 hover:bg-black text-white font-black rounded-3xl shadow-xl shadow-rose-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {deleting ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Trash2 size={20} />
                                    OUI, SUPPRIMER
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteProduct;
