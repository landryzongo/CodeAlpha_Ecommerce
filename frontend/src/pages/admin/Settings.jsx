import React, { useState, useEffect } from 'react';
import { RefreshCw, Smartphone, Store, Info } from 'lucide-react';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const SettingsPage = () => {
    const { getAuthenticatedAxios } = useAuth();
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        whatsapp_number: '',
        store_name: 'ELITE STORE',
        store_description: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            const res = await api.get('/settings');
            const settingsMap = {};
            res.data.forEach(s => {
                settingsMap[s.key] = s.value;
            });

            setFormData(prev => ({
                ...prev,
                ...settingsMap
            }));
            setSettings(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des paramètres:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const api = getAuthenticatedAxios();
            if (!api) return;

            const promises = Object.entries(formData).map(([key, value]) => {
                return api.post('/settings', { key, value });
            });
            await Promise.all(promises);
            alert('Paramètres enregistrés avec succès !');
            fetchSettings();
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement:', err);
            alert('Erreur lors de l\'enregistrement des paramètres');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Chargement des paramètres...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Paramètres de la Boutique</h1>
                    <p className="text-slate-500">Gérez les informations générales de votre boutique stockées en base de données.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label htmlFor="store_name" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Store size={18} className="text-indigo-600" />
                                Nom de la Boutique
                            </label>
                            <input
                                type="text"
                                id="store_name"
                                value={formData.store_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Ex: ELITE STORE"
                            />
                        </div>

                        <div className="space-y-4">
                            <label htmlFor="whatsapp_number" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Smartphone size={18} className="text-emerald-600" />
                                Numéro WhatsApp (Admin)
                            </label>
                            <input
                                type="text"
                                id="whatsapp_number"
                                value={formData.whatsapp_number}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Ex: 22677740701"
                            />
                            <p className="text-[11px] text-slate-400">Utilisé pour recevoir les commandes des clients.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label htmlFor="store_description" className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Info size={18} className="text-blue-600" />
                            Description / Pied de page
                        </label>
                        <textarea
                            id="store_description"
                            rows="4"
                            value={formData.store_description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                            placeholder="Une brève description de votre boutique..."
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={20} /> : null}
                            Appliquer les changements
                        </button>
                    </div>
                </form>
            </div>

            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <div className="bg-amber-100 p-2 rounded-lg h-fit text-amber-600">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 mb-1">Stockage MongoDB</h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                        Ces informations sont désormais stockées dans votre base de données MongoDB.
                        Toute modification sera immédiatement répercutée sur le site client.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
