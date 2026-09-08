import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/client/Home';
import ProductDetail from './pages/client/ProductDetail';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/client/Login';
import Profile from './pages/client/Profile';
import Orders from './pages/client/Orders';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    const location = useLocation();
    const isStandalonePage = ['/login'].includes(location.pathname);

    if (isStandalonePage) {
        return (
            <ErrorBoundary>
                <ThemeProvider>
                    <AuthProvider>
                        <CartProvider>
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    className: 'dark:bg-slate-900 dark:text-white',
                                    duration: 3000,
                                }}
                            />
                            <Routes>
                                <Route path="/login" element={<Login />} />
                            </Routes>
                        </CartProvider>
                    </AuthProvider>
                </ThemeProvider>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <div className="min-h-screen flex flex-col text-white transition-colors duration-300">
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    className: 'dark:bg-slate-900 dark:text-white',
                                    duration: 3000,
                                }}
                            />
                            <Navbar />
                            <main className="flex-grow w-full pb-[80px] md:pb-0">
                                <div className="w-full">
                                    <Routes>
                                        {/* Client Routes */}
                                        <Route path="/" element={<Home />} />
                                        <Route path="/product/:id" element={<ProductDetail />} />
                                        <Route path="/cart" element={<Cart />} />
                                        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                                        {/* Redirect any unknown routes to home */}
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </div>
                            </main>
                            <Footer />
                        </div>
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
