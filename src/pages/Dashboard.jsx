import React, { useState, useEffect, useMemo } from 'react';
import { fetchProducts } from '../services/api';
import { Package, Star, CircleDollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Performance Optimization: Compute metrics exactly once when data arrives
  const { totalProducts, averageRating, totalInventoryValue, categoryData, pieChartData } = useMemo(() => {
    if (!products.length) return { totalProducts: 0, averageRating: 0, totalInventoryValue: 0, categoryData: [], pieChartData: [] };

    let totalValue = 0;
    let totalRating = 0;
    const categoryCount = {};

    products.forEach(p => {
      totalValue += (p.price * p.stock);
      totalRating += p.rating;
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    // Map the category counts into array format for Recharts
    const formattedCategoryData = Object.keys(categoryCount).map(key => ({
      name: key.replace('-', ' '),
      value: categoryCount[key]
    })).sort((a, b) => b.value - a.value); 

    // Fix overlapping legends: Group smaller categories into "Others" for the Pie Chart
    const topCategories = formattedCategoryData.slice(0, 5);
    const othersCount = formattedCategoryData.slice(5).reduce((sum, item) => sum + item.value, 0);
    if (othersCount > 0) {
      topCategories.push({ name: 'Others', value: othersCount });
    }

    return {
      totalProducts: products.length,
      averageRating: (totalRating / products.length).toFixed(1),
      totalInventoryValue: totalValue.toFixed(2),
      categoryData: formattedCategoryData,
      pieChartData: topCategories
    };
  }, [products]);

  // High contrast monochrome + red palette to match tokens
  const COLORS = ['#111111', '#DC2626', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB'];

  if (loading) {
    return <div className="p-6 text-muted flex justify-center items-center h-[50vh]">Loading Analytics Dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-bg p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
          <div className="p-3 bg-secondary-bg rounded-md text-primary-text border border-gray-100">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Total Products</p>
            <p className="text-2xl font-bold text-primary-text">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-primary-bg p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
          <div className="p-3 bg-secondary-bg rounded-md text-primary-text border border-gray-100">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Average Rating</p>
            <p className="text-2xl font-bold text-primary-text">{averageRating} <span className="text-sm font-normal text-muted">/ 5.0</span></p>
          </div>
        </div>

        <div className="bg-primary-bg p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
          <div className="p-3 bg-[#fef2f2] rounded-md text-accent border border-[#fecaca]">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Total Inventory Value</p>
            <p className="text-2xl font-bold text-primary-text">${Number(totalInventoryValue).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recharts Data Viz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {/* Category Distribution (Pie Chart) */}
        <div className="bg-primary-bg p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-primary-text mb-6">Category Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="45%" innerRadius={75} outerRadius={105} paddingAngle={2} dataKey="value">
                  {pieChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontWeight: 500, color: '#111111' }} />
                <Legend verticalAlign="bottom" height={48} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 7 Categories by Volume (Bar Chart) */}
        <div className="bg-primary-bg p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-primary-text mb-6">Products per Category (Top 7)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData.slice(0, 7)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontWeight: 500 }} />
                <Bar dataKey="value" fill="#111111" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}