import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublishProvider } from './context/PublishContext';

// We will create this MainLayout component next
import MainLayout from './components/layout/MainLayout';

// Lazy loading components for Performance Optimization
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Settings = lazy(() => import('./pages/Settings'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PublishProvider>
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Main Layout acts as a wrapper for all dashboard routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Catch-all route to redirect unknown URLs back to the Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PublishProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}