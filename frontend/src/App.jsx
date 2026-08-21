import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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

import { useLocation } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminAddCategory from './pages/admin/AddCategory';
import AdminDeleteProduct from './pages/admin/DeleteProduct';
import AdminOrders from './pages/admin/Orders';
import UsersPage from './pages/admin/Users';
import SettingsPage from './pages/admin/Settings';


function App() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isStandalonePage = ['/login'].includes(location.pathname);
    const isHomePage = location.pathname === '/';

    // Pages standalone : pas de Navbar, pas de Footer, pas de padding top
    if (isStandalonePage) {
        return (
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
        );
    }

    return (
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
                        {isHomePage && <Navbar />}
                        
                        {/* 
                          - Desktop: no padding-top needed because TopNavbar is sticky
                          - Mobile: needs pb-[80px] to not hide content behind the fixed BottomNavbar 
                        */}
                        <main className={`flex-grow w-full ${!isAdminRoute ? 'pb-[80px] md:pb-0' : ''}`}>
                            <div className={!isAdminRoute ? "w-full" : ""}>
                                <Routes>
                                    {/* Client Routes */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/product/:id" element={<ProductDetail />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/orders" element={<Orders />} />

                                    {/* Admin Routes */}
                                    <Route path="/admin/*" element={
                                        <AdminLayout>
                                            <Routes>
                                                <Route path="/" element={<Dashboard />} />
                                                <Route path="/products" element={<AdminProducts />} />
                                                <Route path="/products/delete/:id" element={<AdminDeleteProduct />} />
                                                <Route path="/categories/add" element={<AdminAddCategory />} />
                                                <Route path="/orders" element={<AdminOrders />} />
                                                <Route path="/users" element={<UsersPage />} />
                                                <Route path="/settings" element={<SettingsPage />} />
                                            </Routes>
                                        </AdminLayout>
                                    } />
                                </Routes>
                            </div>
                        </main>
                    </div>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
