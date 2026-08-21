import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, Filter, X, Upload, Image as ImageIcon } from 'lucide-react';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
    const { getAuthenticatedAxios } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: '',
        isFeatured: false,
        tags: '',
        sizes: '',
        colors: '' // Format: name:hex,name:hex
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [dbCategories, setDbCategories] = useState([]);
    const fileInputRef = useRef(null);

    // Default categories + dynamic ones from existing products + extras
    const availableCategories = React.useMemo(() => {
        const allRawCategories = [
            ...dbCategories.map(c => c.name),
            ...products.map(p => p.category)
        ];

        // Unicité robuste (insensible à la casse, accents et espaces)
        const uniqueMap = new Map();

        allRawCategories.forEach(cat => {
            if (!cat || typeof cat !== 'string') return;
            const cleanCat = cat.trim();
            if (!cleanCat) return;

            // Clé normalisée : minuscule + sans accent pour fusionner "Électronique" et "Electronique"
            const key = cleanCat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // On garde la première version rencontrée
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, cleanCat);
            }
        });

        return Array.from(uniqueMap.values())
            .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
    }, [products, dbCategories]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            const res = await api.get('/categories');
            setDbCategories(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des catégories:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des produits:', err);
            alert('Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (product = null) => {
        // Si product existe et a un _id, c'est une modification
        if (product && (product._id || product.id)) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price ? product.price.toString() : '',
                category: product.category || '',
                image: product.image || '',
                stock: product.stock !== undefined ? product.stock.toString() : '0',
                isFeatured: product.isFeatured || false,
                tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
                sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
                colors: Array.isArray(product.colors) ? product.colors.map(c => `${c.name}:${c.hex}`).join(', ') : ''
            });
            setImagePreview(product.image?.startsWith('/uploads/')
                ? `${API_BASE_URL.replace(/\/api$/, '')}${product.image}`
                : product.image);
            setImageFile(null);
        } else {
            // Sinon c'est une création (nouveau produit)
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                image: '',
                stock: '0',
                isFeatured: false,
                tags: '',
                sizes: '',
                colors: ''
            });
            setImagePreview(null);
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            stock: '',
            isFeatured: false,
            tags: '',
            sizes: '',
            colors: ''
        });
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('L\'image est trop grande. Taille maximale : 5MB');
                return;
            }

            // Vérifier le type
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('=== handleSubmit called ===');
        console.log('formData:', formData);
        try {
            const api = getAuthenticatedAxios();
            if (!api) {
                console.error('API non disponible');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', formData.stock);
            formDataToSend.append('isFeatured', formData.isFeatured);

            // Process tags, sizes, colors
            const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
            const sizes = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
            const colors = formData.colors.split(',').map(c => {
                const [name, hex] = c.split(':');
                return { name: name?.trim(), hex: hex?.trim() };
            }).filter(c => c.name && c.hex);

            tags.forEach(t => formDataToSend.append('tags[]', t));
            sizes.forEach(s => formDataToSend.append('sizes[]', s));
            formDataToSend.append('colors', JSON.stringify(colors));

            // Si une nouvelle image est sélectionnée, l'ajouter
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            } else if (formData.image && !editingProduct) {
                // Si c'est une création et qu'une URL est fournie
                formDataToSend.append('image', formData.image);
            }

            console.log('Envoi de la requête...');
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formDataToSend);
                console.log('Produit mis à jour');
            } else {
                await api.post(`/products`, formDataToSend);
                console.log('Produit créé');
            }

            console.log('Rafraîchissement des produits...');
            await fetchProducts();
            console.log('Fermeture du modal...');
            closeModal();
            console.log('Succès !');
        } catch (err) {
            console.error('Erreur COMPLÈTE lors de la sauvegarde:', err);
            console.error('Réponse serveur:', err.response);
            const message = err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde du produit';
            alert(`Erreur: ${message}`);
        }
    };


    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">Gestion des Produits</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Ajoutez, modifiez ou supprimez vos produits.</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
                    <button
                        onClick={() => navigate('/admin/categories/add')}
                        className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
                    >
                        <Plus size={18} />
                        <span className="whitespace-nowrap">Ajouter Catégorie</span>
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
                    >
                        <Plus size={18} />
                        <span className="whitespace-nowrap">Nouveau Produit</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full md:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    >
                        <option value="all">Toutes les catégories</option>
                        {availableCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Produit</th>
                                <th className="hidden lg:table-cell px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Catégorie</th>
                                <th className="px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Prix</th>
                                <th className="hidden sm:table-cell px-4 py-4 text-left text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Stock</th>
                                <th className="px-4 py-4 text-right text-[10px] lg:text-xs font-black uppercase tracking-wider text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center text-slate-400 text-sm">
                                        {searchQuery || filterCategory !== 'all'
                                            ? 'Aucun produit trouvé'
                                            : 'Aucun produit pour le moment'}
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image?.startsWith('/uploads/')
                                                        ? `${API_BASE_URL.replace(/\/api$/, '')}${product.image}`
                                                        : product.image}
                                                    alt={product.name}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-sm border border-slate-100"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/48';
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <span className="font-bold text-slate-900 block truncate text-sm sm:text-base">{product.name}</span>
                                                    <span className="hidden lg:block text-xs text-slate-400 line-clamp-1">{product.description}</span>
                                                    <span className="lg:hidden text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell px-4 py-4">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-bold text-slate-700 text-sm sm:text-base">
                                            {product.price.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">F</span>
                                        </td>
                                        <td className="hidden sm:table-cell px-4 py-4">
                                            <span className={`text-xs sm:text-sm font-black ${product.stock < 5 ? 'text-rose-500' : product.stock < 15 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-1 sm:gap-2">
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/products/delete/${product._id}`)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Add/Edit Product */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Nom du produit *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                                            placeholder="Ex: Smartphone Galaxy Pro"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="4"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-slate-900 font-medium"
                                            placeholder="Description détaillée du produit..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Prix (FCFA) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Stock *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Catégorie *
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {availableCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>



                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Image du produit *
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label
                                                    htmlFor="image-upload"
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold cursor-pointer transition-all border-2 border-dashed border-indigo-300"
                                                >
                                                    <Upload size={18} />
                                                    {imageFile ? 'Changer l\'image' : 'Choisir une image'}
                                                </label>
                                                {imageFile && (
                                                    <span className="text-sm text-slate-500">
                                                        {imageFile.name}
                                                    </span>
                                                )}
                                            </div>

                                            {imagePreview && (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-64 object-cover rounded-xl border border-slate-200"
                                                    />
                                                </div>
                                            )}

                                            {!imageFile && !imagePreview && (
                                                <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                                    <div className="text-center">
                                                        <ImageIcon size={48} className="text-slate-300 mx-auto mb-2" />
                                                        <p className="text-sm text-slate-500">Aucune image sélectionnée</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!imageFile && !imagePreview && !editingProduct}
                                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {editingProduct ? 'CONFIRMER' : 'CRÉER LE PRODUIT'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )
                }
            </AnimatePresence>
        </div>
    );
};

export default Products;
