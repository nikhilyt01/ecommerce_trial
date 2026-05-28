import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { useUrlState } from '../hooks/useUrlState';
import { useDebounce } from '../hooks/useDebounce';
import ProductTable from '../components/products/ProductTable';
import { useAuth } from '../context/AuthContext';

const ALL_COLUMNS = [
  { id: 'image', label: 'Preview' },
  { id: 'name', label: 'Product Name' },
  { id: 'category', label: 'Category' },
  { id: 'price', label: 'Price' },
  { id: 'stock', label: 'Status' },
  { id: 'rating', label: 'Rating' },
  { id: 'actions', label: 'Actions' }
];

const ITEMS_PER_PAGE = 10;

export default function ProductList() {
  // Auth & Publish State
  const { isAdmin } = useAuth();

  // 1. URL State Management
  const { searchParam, categoryParam, sortByParam, orderParam, pageParam, updateParam, updateParams } = useUrlState();

  // 2. Local State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchParam);
  const [visibleColumns, setVisibleColumns] = useState(ALL_COLUMNS.map(c => c.id));
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // 3. Performance Optimization #1: Debounce search input
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      updateParam('q', debouncedSearch);
    }
  }, [debouncedSearch, searchParam, updateParam]);

  // Fetch data on initial load
  useEffect(() => {
    let intervalId;
    const loadData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    intervalId = setInterval(loadData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Extract unique categories for the dropdown filter
  const categories = useMemo(() => {
    const unique = [...new Set(products.map(p => p.category))];
    return unique.sort();
  }, [products]);

  // Performance Optimization #2: Sort and filter inside useMemo
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Publish Filter (Only show published if not admin)
    if (!isAdmin) {
      result = result.filter(p => p.isPublished); // Rely on backend field instead of isPublished context logic
    }

    // Text Filter
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category Filter
    if (categoryParam !== 'all') {
      result = result.filter(p => p.category === categoryParam);
    }

    // Sorting Engine
    result.sort((a, b) => {
      if (!sortByParam) return 0;
      let valA = a[sortByParam === 'name' ? 'title' : sortByParam];
      let valB = b[sortByParam === 'name' ? 'title' : sortByParam];

      // Handle null/undefined values
      if (valA === undefined) valA = '';
      if (valB === undefined) valB = '';

      if (valA < valB) return orderParam === 'asc' ? -1 : 1;
      if (valA > valB) return orderParam === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchParam, categoryParam, sortByParam, orderParam, isAdmin]);

  // Calculate Pagination Splitting
  const paginatedProducts = useMemo(() => {
    const start = (pageParam - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [processedProducts, pageParam]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE) || 1;

  // Performance Optimization #3: useCallback for table sorting handler
  const handleSort = useCallback((field, order) => {
    updateParams({ sortBy: field, order: order });
  }, [updateParams]);

  const toggleColumn = (colId) => {
    setVisibleColumns(prev => 
      prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-primary-bg p-4 rounded-lg border border-gray-200 shadow-sm">
        
        {/* Left Side: Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-primary-text focus:ring-1 focus:ring-primary-text transition-all bg-primary-bg text-primary-text"
          />
        </div>

        {/* Right Side: Filters & Column Management */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          
          <select
            value={categoryParam}
            onChange={(e) => updateParam('category', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none bg-primary-bg text-primary-text capitalize cursor-pointer hover:border-gray-300 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
            ))}
          </select>

          <select
            value={sortByParam && orderParam ? `${sortByParam}-${orderParam}` : 'default'}
            onChange={(e) => {
              if (e.target.value === 'default') {
                updateParams({ sortBy: '', order: '' });
              } else {
                const [sort, order] = e.target.value.split('-');
                updateParams({ sortBy: sort, order: order });
              }
            }}
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none bg-primary-bg text-primary-text capitalize cursor-pointer hover:border-gray-300 transition-colors"
          >
            <option value="default">Sort By</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
          </select>

          {/* Bonus Requirement: Column Customization Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-md bg-secondary-bg hover:bg-gray-100 text-primary-text transition-colors w-full sm:w-auto"
            >
              <LayoutGrid size={16} />
              <span>Columns</span>
            </button>
            
            {showColumnDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-primary-bg border border-gray-200 rounded-md shadow-lg z-20 p-2">
                <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">Toggle Columns</div>
                {ALL_COLUMNS.map((col) => (
                  <label key={col.id} className="flex items-center gap-2 p-2 hover:bg-secondary-bg rounded cursor-pointer text-sm text-primary-text transition-colors">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.id)}
                      onChange={() => toggleColumn(col.id)}
                      className="accent-primary-text w-4 h-4 cursor-pointer"
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid / Table */}
      <ProductTable 
        products={paginatedProducts} 
        loading={loading}
        visibleColumns={visibleColumns}
        sortByParam={sortByParam}
        orderParam={orderParam}
        onSort={handleSort}
        isAdmin={isAdmin}
      />

      {/* Pagination Footer controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-2 text-sm text-muted">
        <span>Showing {(pageParam - 1) * ITEMS_PER_PAGE + 1} to {Math.min(pageParam * ITEMS_PER_PAGE, processedProducts.length)} of {processedProducts.length} entries</span>
        <div className="flex gap-2">
          <button disabled={pageParam <= 1} onClick={() => updateParam('page', pageParam - 1)} className="p-2 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-bg hover:text-primary-text transition-colors flex items-center gap-1"><ChevronLeft size={16} /> <span className="hidden sm:inline">Prev</span></button>
          <button disabled={pageParam >= totalPages} onClick={() => updateParam('page', pageParam + 1)} className="p-2 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-bg hover:text-primary-text transition-colors flex items-center gap-1"><span className="hidden sm:inline">Next</span> <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}