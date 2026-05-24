import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// We will create this MainLayout component next
import MainLayout from './components/layout/MainLayout';
import ProductList from './pages/ProductList';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
    </BrowserRouter>
  );
}