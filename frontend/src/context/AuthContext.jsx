import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

const API_URL = `${API_BASE_URL}/auth`;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/profile`);
            setUser(res.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            // Only logout if token is invalid (401)
            if (err.response && err.response.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            toast.success('Connexion réussie !');
            setLoading(false);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur de connexion');
            setLoading(false);
            return false;
        }
    };

    const register = async (userData, navigate) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/register`, userData);
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            toast.success('Compte créé avec succès !');
            setLoading(false);

            // Rediriger vers l'accueil après inscription
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 500);

            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la création du compte');
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Déconnecté');
    };

    const updateProfile = async (userData) => {
        try {
            const res = await axios.put(`${API_URL}/profile`, userData);
            setUser(res.data);
            toast.success('Profil mis à jour !');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
            return false;
        }
    };

    const getAuthenticatedAxios = () => {
        if (!token) return null;
        return axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, getAuthenticatedAxios, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
