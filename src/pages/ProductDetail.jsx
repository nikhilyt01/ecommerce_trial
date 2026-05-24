import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { ArrowLeft, Star, Tag, Package, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadProduct();
    }
  }, [id]);

  const nextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return <div className="p-6 text-muted flex justify-center items-center h-[50vh]">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="p-6 text-center">
        <p className="text-accent mb-4">{error || 'Product not found'}</p>
        <Link to="/products" className="text-muted hover:text-primary-text underline">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/products" className="p-2 border border-gray-200 rounded-md hover:bg-secondary-bg transition-colors text-muted hover:text-primary-text">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-muted text-sm">Back to Products</span>
      </div>

      <div className="bg-primary-bg border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Image Carousel */}
        <div className="w-full md:w-1/2 relative bg-secondary-bg border-b md:border-b-0 md:border-r border-gray-200 min-h-75 flex items-center justify-center p-8">
          {product.images && product.images.length > 0 ? (
            <>
              <img 
                src={product.images[currentImageIndex]} 
                alt={`${product.title} - view ${currentImageIndex + 1}`} 
                className="max-h-100px object-contain mix-blend-multiply"
              />
              
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-primary-bg/80 border border-gray-200 rounded-full shadow-sm hover:bg-primary-bg text-primary-text transition-all"><ChevronLeft size={20} /></button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary-bg/80 border border-gray-200 rounded-full shadow-sm hover:bg-primary-bg text-primary-text transition-all"><ChevronRight size={20} /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary-text w-4' : 'bg-gray-300'}`} aria-label={`Go to image ${idx + 1}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-muted">No images available</div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h1 className="text-2xl font-bold text-primary-text leading-tight">{product.title}</h1>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary-text block">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="px-2 py-0.5 mt-1 inline-block text-xs font-bold bg-[#DC2626] text-white rounded">-{product.discountPercentage}% OFF</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted">
            <div className="flex items-center gap-1 bg-secondary-bg px-2 py-1 rounded-md border border-gray-100"><Tag size={14} /><span className="capitalize">{product.category.replace('-', ' ')}</span></div>
            <div className="flex items-center gap-1 text-amber-500 font-medium"><Star size={14} fill="currentColor" /><span>{product.rating}</span></div>
            <div className="flex items-center gap-1"><Package size={14} />{product.stock <= 5 ? (<span className="text-accent font-semibold">Low Stock ({product.stock})</span>) : (<span className="text-emerald-600 font-medium">In Stock ({product.stock})</span>)}</div>
          </div>

          <div className="mb-8 flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">Description</h2>
            <p className="text-primary-text leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted border-t border-gray-100 pt-6">
            <div><span className="block font-medium mb-1">Brand</span><span className="text-primary-text">{product.brand || 'Generic'}</span></div>
            <div><span className="block font-medium mb-1">SKU</span><span className="text-primary-text">{product.sku || 'N/A'}</span></div>
            <div><span className="block font-medium mb-1">Weight</span><span className="text-primary-text">{product.weight ? `${product.weight} oz` : 'N/A'}</span></div>
            <div><span className="block font-medium mb-1">Dimensions</span><span className="text-primary-text">{product.dimensions ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} in` : 'N/A'}</span></div>
          </div>

          {/* Render User Reviews Stream */}
          <div className="space-y-3 pt-6 mt-6 border-t border-gray-100 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Evaluations ({product.reviews?.length || 0})</h3>
            <div className="divide-y divide-gray-100">
              {product.reviews?.map((rev, i) => (
                <div key={i} className="py-3 text-sm space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary-text">{rev.reviewerName}</span>
                    <span className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">★ {rev.rating}</span>
                  </div>
                  <p className="text-muted italic text-xs">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}