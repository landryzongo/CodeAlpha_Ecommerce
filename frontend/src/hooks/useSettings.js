import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export const useSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/settings`);
                const settingsMap = {};
                res.data.forEach(s => {
                    settingsMap[s.key] = s.value;
                });
                setSettings(settingsMap);
            } catch (err) {
                console.error('Error fetching settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return { settings, loading };
};
