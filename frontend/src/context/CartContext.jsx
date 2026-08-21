import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        try {
            const parsed = savedCart ? JSON.parse(savedCart) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    // Initial local storage sync
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, qty = 1) => {
        setCart(prevCart => {
            const productId = product._id || product.id;
            const existingProduct = prevCart.find(item => (item._id || item.id) === productId);
            if (existingProduct) {
                return prevCart.map(item =>
                    (item._id || item.id) === productId ? { ...item, quantity: item.quantity + qty } : item
                );
            }
            return [...prevCart, { ...product, quantity: qty }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => (item._id || item.id) !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                (item._id || item.id) === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    // Calcul optimisé avec useMemo pour mise à jour en temps réel
    const totalAmount = useMemo(() => {
        return cart.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    }, [cart]);

    const totalItems = useMemo(() => {
        return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};
