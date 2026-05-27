import React from 'react';
import { Eye, EyeOff, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

// Performance Optimization #4: React.memo on individual rows.
// When our live polling updates a single product's stock, only that 
// specific row re-renders instead of the entire table page.
const ProductRow = React.memo(({ product, visibleColumns, isAdmin }) => {
  const published = product.isPublished;
  
  const handleToggle = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      const response = await fetch(`${API_URL}/api/products/${product.id}/toggle-publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error("Failed to toggle publish status");
      }
      // Note: We don't need to manually update state here because the polling 
      // mechanism in ProductList will automatically fetch the updated status.
    } catch (error) {
      console.error("Error toggling publish status", error);
    }
  };

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${!published ? 'opacity-60' : ''}`}>
      {visibleColumns.includes('image') && <td className="p-4"><img src={product.thumbnail} alt={product.title} className="w-12 h-12 object-cover rounded bg-secondary-bg border border-gray-100" /></td>}
      {visibleColumns.includes('name') && <td className="p-4 font-medium text-primary-text truncate max-w-50">
        <Link to={`/products/${product.id}`} className="hover:underline">{product.title}</Link>
        {!published && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Unpublished</span>}
      </td>}
      {visibleColumns.includes('category') && <td className="p-4 text-muted capitalize">{product.category.replace('-', ' ')}</td>}
      {visibleColumns.includes('price') && <td className="p-4 font-semibold text-primary-text">${product.price.toFixed(2)}</td>}
      {visibleColumns.includes('stock') && (
        <td className="p-4">
          {product.stock <= 5 ? (<span className="px-2 py-0.5 text-xs font-medium bg-[#DC2626] text-white rounded">Low Stock</span>) : (<span className="text-emerald-600 font-medium">In Stock ({product.stock})</span>)}
        </td>
      )}
      {visibleColumns.includes('rating') && <td className="p-4 text-amber-500 font-medium">★ {product.rating}</td>}
      {visibleColumns.includes('actions') && (
        <td className="p-4 text-center space-x-2">
          {isAdmin && (
            <button 
              onClick={handleToggle}
              className="inline-block p-2 text-muted hover:text-primary-text hover:bg-gray-100 rounded-md transition-colors"
              title={published ? "Unpublish" : "Publish"}
            >
              {published ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
        </td>
      )}
    </tr>
  );
});

const ProductTable = ({ 
  products, 
  loading, 
  visibleColumns, 
  sortByParam, 
  orderParam, 
  onSort,
  isAdmin
}) => {
  
  const handleHeaderClick = (field) => {
    const newOrder = (sortByParam === field && orderParam === 'asc') ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const renderSortIndicator = (field) => {
    if (sortByParam !== field) return null;
    return <span className="ml-1">{orderParam === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="overflow-x-auto border border-gray-100 rounded-lg bg-primary-bg shadow-sm">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400 font-semibold">
            {visibleColumns.includes('image') && <th className="p-4 w-20 font-semibold">Preview</th>}
            
            {visibleColumns.includes('name') && (
              <th className="p-4 cursor-pointer hover:text-primary-text transition-colors font-semibold" onClick={() => handleHeaderClick('name')}>
                Product Name {renderSortIndicator('name')}
              </th>
            )}
            
            {visibleColumns.includes('category') && <th className="p-4 font-semibold">Category</th>}
            
            {visibleColumns.includes('price') && (
              <th className="p-4 cursor-pointer hover:text-primary-text transition-colors font-semibold" onClick={() => handleHeaderClick('price')}>
                Price {renderSortIndicator('price')}
              </th>
            )}
            
            {visibleColumns.includes('stock') && <th className="p-4 font-semibold">Status</th>}
            
            {visibleColumns.includes('rating') && (
              <th className="p-4 cursor-pointer hover:text-primary-text transition-colors font-semibold" onClick={() => handleHeaderClick('rating')}>
                Rating {renderSortIndicator('rating')}
              </th>
            )}
            
            {visibleColumns.includes('actions') && <th className="p-4 text-center font-semibold">Actions</th>}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-200 text-sm">
          {loading ? (
            <tr>
              <td colSpan={visibleColumns.length} className="text-center p-8 text-muted">
                Loading product catalog...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={visibleColumns.length} className="text-center p-8 text-muted">
                No products match your criteria.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductRow 
                key={product.id} 
                product={product} 
                visibleColumns={visibleColumns} 
                isAdmin={isAdmin}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Performance Optimization #4: React.memo prevents unnecessary re-renders when parent state updates.
export default React.memo(ProductTable);