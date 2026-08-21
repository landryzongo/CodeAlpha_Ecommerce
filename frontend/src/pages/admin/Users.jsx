import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, MoreVertical, Edit2, Trash2, Search, X, Lock } from 'lucide-react';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const { getAuthenticatedAxios } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'client'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des utilisateurs:', err);
            // Si l'endpoint n'existe pas encore, utiliser des données vides
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email,
                password: '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                email: '',
                password: '',
                role: 'client'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            email: '',
            password: '',
            role: 'client'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            if (editingUser) {
                // Mise à jour - seulement si un nouveau mot de passe est fourni
                const updateData = { role: formData.role };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await api.put(`/users/${editingUser._id}`, updateData);
            } else {
                // Création
                await api.post('/users', formData);
            }

            await fetchUsers();
            closeModal();
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
            alert(err.response?.data?.message || 'Erreur lors de la sauvegarde de l\'utilisateur');
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                const api = getAuthenticatedAxios();
                if (!api) return;

                await api.delete(`/users/${id}`);
                await fetchUsers();
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
                alert('Erreur lors de la suppression de l\'utilisateur');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
                    <p className="text-slate-500">Gérez les comptes admin et clients.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
                >
                    <UserPlus size={20} />
                    Nouvel utilisateur
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher par email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Email</th>
                                <th className="table-header">Rôle</th>
                                <th className="table-header">Date de création</th>
                                <th className="table-header text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="table-cell text-center text-slate-400 py-12">
                                        {searchQuery
                                            ? 'Aucun utilisateur trouvé'
                                            : 'Aucun utilisateur pour le moment'}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Mail size={14} />
                                                <span className="font-bold text-slate-900">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className={user.role === 'admin' ? 'text-indigo-600' : 'text-slate-400'} />
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin'
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'bg-slate-50 text-slate-600'
                                                    }`}>
                                                    {user.role === 'admin' ? 'Administrateur' : 'Client'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="table-cell text-slate-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="table-cell text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(user)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Supprimer"
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

            {/* Modal Add/Edit User */}
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
                                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                            >
                                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
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
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            disabled={!!editingUser}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="exemple@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            {editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="password"
                                                required={!editingUser}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Rôle *
                                        </label>
                                        <select
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="client">Client</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
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
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30"
                                        >
                                            {editingUser ? 'Valider les changements' : 'Créer l\'utilisateur'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;
